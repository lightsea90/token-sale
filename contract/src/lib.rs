/*
Functions:
    * deposit: deposit NEAR to the contract
    * get_status: get the sale status =>
        * total deposit
        * current price
        * total tokens for sale
        * stage: wait, sale, grace, end
    * redeem: get the tokens from contract to wallet
 */


extern crate chrono;
// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::serde_json::json;
use near_sdk::{env, near_bindgen, ext_contract, assert_one_yocto};
use near_sdk::collections::UnorderedMap;
use near_sdk::{AccountId, Balance, Timestamp, Duration, Gas};
use near_sdk::{Promise, PromiseResult};
use near_sdk::json_types::{U128, WrappedBalance, WrappedDuration};

use chrono::prelude::{Utc, DateTime};

mod admin;
mod view;

near_sdk::setup_alloc!();

// Sample parameters
const TOTAL_NUMBER_OF_TOKENS_FOR_SALE: Balance = 100_000_000;
const TOKEN_SALE_START_TIME_ISO8601: &str = "2021-09-15T12:00:09Z";
const SALE_DURATION: Duration = 24 * 60 * 60 * 1_000_000_000;
const GRACE_DURATION: Duration = 24 * 60 * 60 * 1_000_000_000;
const MINIMUM_ALLOWED_DEPOSIT: Balance = 200_000_000_000_000_000_000_000;
const BALANCE_BASE_UNIT: Balance = 1_000_000_000_000_000_000_000_000;
const DEFAULT_GAS_TO_PAY: Gas = 20_000_000_000_000;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct NumberOfTokens {
    amount: Balance,
    formatted_amount: f64,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct SaleInfo {
    ft_contract_name: AccountId,
    num_of_tokens: Balance,
    start_time: Timestamp,
    sale_duration: Duration,
    grace_duration: Duration,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserSaleInfo {
    deposit: WrappedBalance,
    total_allocated_tokens: WrappedBalance,
    is_redeemed: u8,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct TokenSale {
    owner_id: AccountId,
    ft_contract_name: AccountId,
    num_of_tokens: Balance,
    deposit_map: UnorderedMap<AccountId, Balance>,
    start_time: Timestamp,
    sale_duration: Duration,
    grace_duration: Duration,
    is_finished: bool,
    redeemed_map: UnorderedMap<AccountId, u8>,
    sale_owner: AccountId,
    fund_claimed: bool,
}

#[ext_contract(ext_self)]
pub trait ExtTokenSale {
    fn on_withdrawal_finished(&mut self, predecessor_account_id: AccountId, amount_to_withdraw: Balance) -> bool;
    fn on_redeem_finished(&mut self, predecessor_account_id: AccountId, amount_to_redeem: Balance) -> bool;
}

impl Default for TokenSale {
    fn default() -> Self {
        Self {
            owner_id: "default_owner_id".to_string(),
            ft_contract_name: "thisisjustasampletoken".to_string(),
            num_of_tokens: TOTAL_NUMBER_OF_TOKENS_FOR_SALE,
            deposit_map: UnorderedMap::new(b"a".to_vec()),
            start_time: {
                TOKEN_SALE_START_TIME_ISO8601
                .parse::<DateTime<Utc>>()
                .unwrap().timestamp_nanos() as Timestamp
            },
            sale_duration: SALE_DURATION,
            grace_duration: GRACE_DURATION,
            is_finished: false,
            redeemed_map: UnorderedMap::new(b"c".to_vec()),
            sale_owner: "default_sale_owner".to_string(),
            fund_claimed: false,
        }
    }
}

#[near_bindgen]
impl TokenSale {

    // deposit to the sale
    #[payable]
    pub fn deposit(&mut self) {
        assert!(
            env::attached_deposit() > MINIMUM_ALLOWED_DEPOSIT,
            "Attached deposit must be greater than MINIMUM_ALLOWED_DEPOSIT",
        );
        let current_ts = env::block_timestamp();
        assert!(
            current_ts >= self.start_time && current_ts <= self.start_time + self.sale_duration,
            "Now is not time for deposit",
        );

        let account_id = env::signer_account_id();
        let current_value = self.deposit_map.get(&account_id).unwrap_or(0);
        self.deposit_map.insert(&account_id, &(current_value + env::attached_deposit()));
    }

    // withdraw from the sale
    #[payable]
    pub fn withdraw(&mut self, amount: U128) -> Promise {
        assert_one_yocto();
        let current_ts = env::block_timestamp();
        assert!(
            current_ts >= self.start_time
                && current_ts <= self.start_time + self.sale_duration + self.grace_duration,
            "Now is not time for withdrawal",
        );

        let account_id = env::signer_account_id();
        let current_value = self.deposit_map.get(&account_id).unwrap_or(0);
        let amount_to_withdraw: Balance = amount.into();
        env::log(format!("amount: {}", amount_to_withdraw).as_bytes());
        env::log(format!("current_value: {}", current_value).as_bytes());
        env::log(format!("account_id: {}", account_id).as_bytes());

        assert!(
            (amount_to_withdraw <= current_value) && (amount_to_withdraw > 0),
            "Amount of withdrawal is invalid",
        );

        return Promise::new(env::signer_account_id())
            .transfer(amount_to_withdraw)
            .then(
                ext_self::on_withdrawal_finished(
                    account_id, amount_to_withdraw,
                    &env::current_account_id(),
                    0,
                    DEFAULT_GAS_TO_PAY,
                )
            );
    }

    // callback for withdrawal action
    pub fn on_withdrawal_finished(&mut self, predecessor_account_id: AccountId, amount_to_withdraw: Balance) -> bool {
        env::log(b"Calling on_withdrawal_finished now");
        assert!(
            env::predecessor_account_id() == env::current_account_id(),
            "Callback is not called from the contract itself",
        );
        assert!(
            env::promise_results_count() == 1,
            "Function called not as a callback",
        );

        match env::promise_result(0) {
            PromiseResult::Successful(_) => {
                let current_value: Balance = self.deposit_map.get(&predecessor_account_id).unwrap();
                assert!(
                    (amount_to_withdraw <= current_value) && (amount_to_withdraw > 0),
                    "Something wrong. Amount of withdrawal is invalid"
                );
                if current_value > amount_to_withdraw {
                    self.deposit_map.insert(&predecessor_account_id, &(current_value - amount_to_withdraw));
                } else {
                    // current_value == amount_to_withdraw => withdraw all
                    self.deposit_map.remove(&predecessor_account_id);
                }
                true
            },
            _ => false
        }
    }

    // Finish the sale. Only valid after grace period
    pub fn finish(&mut self, force: Option<bool>) {
        assert!(!self.is_finished, "The token sale has already been finished");
        assert!(
            force.unwrap_or(false) || (
                env::block_timestamp() > 
                    self.start_time + self.sale_duration + self.grace_duration
            ),
            "It is not time for the sale to finish",
        );

        let account_list = self.deposit_map.keys_as_vector();
        let deposit_list = self.deposit_map.values_as_vector();
        let total_deposit: Balance = deposit_list.iter().sum();
        // let final_price = (total_deposit as f64) / (self.num_of_tokens as f64);
        
        for (i, account_id) in account_list.iter().enumerate() {
            let redeemable_tokens = (
                (deposit_list.get(i as u64).unwrap() as f64) 
                * (self.num_of_tokens as f64) / (total_deposit as f64)
            ) as Balance;
            env::log(format!(
                "Account {} received {} tokens", account_id, redeemable_tokens,
            ).as_bytes());
        }
        self.is_finished = true;
    }

    // Redeem the tokens back to wallet
    #[payable]
    pub fn redeem(&mut self) -> Promise {
        assert_one_yocto();
        let current_ts = env::block_timestamp();
        assert!(
            current_ts >= self.start_time + self.sale_duration + self.grace_duration,
            "Now is not time for redeem",
        );

        let account_id = env::predecessor_account_id();
        let amount_to_redeem = self.get_total_allocated_tokens(account_id.clone());
        assert!(
            self.redeemed_map.get(&account_id).unwrap_or(0) == 0,
            "User has already redeemed",
        );
        assert!(
            amount_to_redeem > 0 && amount_to_redeem <= self.num_of_tokens,
            "The number of tokens to claim is invalid"
        );

        let payout_promise = Promise::new(self.ft_contract_name.clone()).function_call(
            b"ft_transfer".to_vec(), 
            json!({
                "receiver_id": account_id,
                "amount": WrappedBalance::from(amount_to_redeem),
            }).to_string().as_bytes().to_vec(), 
            1, DEFAULT_GAS_TO_PAY,
        );

        return payout_promise.then(
            ext_self::on_redeem_finished(
                account_id, amount_to_redeem,
                &env::current_account_id(),
                0, DEFAULT_GAS_TO_PAY,
            )
        );
    }


    // callback for redeem action
    pub fn on_redeem_finished(&mut self, predecessor_account_id: AccountId, amount_to_redeem: Balance) -> bool {
        env::log(b"Calling on_redeem_finished now");
        assert!(
            env::predecessor_account_id() == env::current_account_id(),
            "Callback is not called from the contract itself",
        );
        assert!(
            env::promise_results_count() == 1,
            "Function called not as a callback",
        );

        match env::promise_result(0) {
            PromiseResult::Successful(_) => {
                let amount_to_redeem_in_theory = self.get_total_allocated_tokens(predecessor_account_id.clone());
                assert!(
                    amount_to_redeem == amount_to_redeem_in_theory,
                    "Something wrong. Amount to redeem has changed",
                );
                assert!(
                    amount_to_redeem > 0 && amount_to_redeem <= self.num_of_tokens,
                    "Something wrong. The number of tokens to claim is invalid",
                );
                self.redeemed_map.insert(&predecessor_account_id, &1);
                env::log(
                    format!("Account {} has redeemed {} tokens", 
                    predecessor_account_id, amount_to_redeem,
                ).as_bytes());
                true
            },
            _ => false
        }
    }

    #[payable]
    pub fn claim_fund(&mut self) -> Promise {
        assert_one_yocto();
        assert!(
            env::predecessor_account_id() == self.sale_owner.clone(),
            "Only sale owner can claim the fund",
        );
        assert!(
            !self.fund_claimed,
            "Fund already claimed",
        );
        let current_ts = env::block_timestamp();
        assert!(
            current_ts >= self.start_time + self.sale_duration + self.grace_duration,
            "Now is not time for redeem",
        );
        
        self.fund_claimed = true;
        let fund = self.get_total_deposit().amount;
        Promise::new(self.sale_owner.clone()).transfer(fund)
    }

}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    // mock the context for testing, notice "signer_account_id" that was accessed above from env::
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "tokensale_near".to_string(),
            signer_account_id: "harrynguyen_near".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "harrynguyen_near".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 1_000_000_000_000_000_000_000_000,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn deposit_and_get_total_deposit() {
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut contract = TokenSale::default();
        contract.deposit();
        assert!(
            contract.get_total_deposit().amount == env::attached_deposit(),
            "Deposit error"
        );
    }

}