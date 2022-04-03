use crate::*;
use near_sdk::serde_json::{Value, json};

#[near_bindgen]
impl TokenSale {

    pub fn get_total_deposit(&self) -> NumberOfTokens {
        assert!(env::state_exists(), "The contract is not initialized");

        let deposit_list = self.deposit_map.values_as_vector();
        let total_deposit: Balance;
        if deposit_list.len() == 0 {
            total_deposit = 0;
        } else {
            total_deposit = deposit_list.iter().sum();
        }
        return NumberOfTokens {
            amount: total_deposit,
            formatted_amount: (total_deposit as f64) / (BALANCE_BASE_UNIT as f64),
        }
    }

    pub fn get_total_deposit_json(&self) -> Value {
        let result = self.get_total_deposit();
        return json!({
            "amount": WrappedBalance::from(result.amount),
            "formatted_amount": result.formatted_amount,
        })
    }

    // get static info of the sale
    pub fn get_sale_info(&self) -> Value {
        // env::log(format!("{}", env::current_account_id()).as_bytes());
        return json!({
            "ft_contract_name": self.ft_contract_name.clone(),
            "num_of_tokens": WrappedBalance::from(self.num_of_tokens),
            "start_time": self.start_time,
            "sale_duration": self.sale_duration,
            "grace_duration": self.grace_duration,
            "sale_owner": self.sale_owner,
            "fund_claimed": self.fund_claimed,
        })
    }

    // check sale status and trigger finish if need
    pub fn check_sale_status(&self) -> String {
        let current_ts = env::block_timestamp();
        let current_sale_status: String = {
            if current_ts < self.start_time {
                String::from("NOT_STARTED")
            } else if current_ts <= self.start_time + self.sale_duration {
                String::from("ON_SALE")
            } else if current_ts <= self.start_time + self.sale_duration + self.grace_duration {
                String::from("ON_GRACE")
            } else {
                env::log(format!("period: FINISHED").as_bytes());
                String::from("FINISHED")
            }
        };
        return current_sale_status;
    }

    // Get the redeemable tokens in total
    pub fn get_total_allocated_tokens(&self, account_id: AccountId) -> Balance {
        let total_deposit = self.get_total_deposit().amount;
        if total_deposit == 0 {
            return 0;
        }
        // let current_price = (total_deposit as f64) / (self.num_of_tokens as f64);
        // let account_id = account_id.unwrap_or(env::signer_account_id());
        let total_redeemable_num = (
            (self.deposit_map.get(&account_id).unwrap_or(0) as f64)
            * (self.num_of_tokens as f64) / (total_deposit as f64)
        ) as Balance;
        return total_redeemable_num;
    }


    pub fn get_user_sale(&self, account_id: AccountId) -> UserSaleInfo {
        return UserSaleInfo {
            deposit: WrappedBalance::from(self.deposit_map.get(&account_id).unwrap_or(0)),
            is_redeemed: self.redeemed_map.get(&account_id).unwrap_or(0),
            total_allocated_tokens: WrappedBalance::from(self.get_total_allocated_tokens(account_id)),
        };
    }

    pub fn get_sale_stats(&self) -> Value {
        return json!({
            "num_of_users": self.deposit_map.keys_as_vector().len(),
            "total_deposit": WrappedBalance::from(self.get_total_deposit().amount),
        });
    }

    pub fn get_owners(&self) -> Value {
        return json!({
            "owner_id": self.owner_id,
            "sale_owner": self.sale_owner,
        });
    }
}