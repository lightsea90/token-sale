use crate::*;

#[near_bindgen]
impl TokenSale {
    #[init]
    pub fn new(
        owner_id: AccountId,
        ft_contract_name: AccountId,
        num_of_tokens: WrappedBalance,
        start_time_iso8601: String,
        sale_duration_in_min: WrappedDuration,
        grace_duration_in_min: WrappedDuration,
        sale_owner: AccountId,
    ) -> Self {
        assert!(
            !env::state_exists(),
            "The contract is already initialized",
        );
        assert!(
            env::is_valid_account_id(&ft_contract_name.as_bytes()),
            "FT contract name is invalid",
        );

        let mut s = Self {
            owner_id: owner_id,
            ft_contract_name: ft_contract_name,
            num_of_tokens: num_of_tokens.into(),
            deposit_map: UnorderedMap::new(b"ax".to_vec()),
            start_time: {
                start_time_iso8601
                .parse::<DateTime<Utc>>()
                .unwrap().timestamp_nanos() as Timestamp
            },
            sale_duration: sale_duration_in_min.into(),
            grace_duration: grace_duration_in_min.into(),
            is_finished: false,
            redeemed_map: UnorderedMap::new(b"cx".to_vec()),
            sale_owner: sale_owner,
            fund_claimed: false,
        };
        s.sale_duration *=  60 * 1_000_000_000;
        s.grace_duration *=  60 * 1_000_000_000;
        return s;
    }

    // reset the sale with new parameters
    pub fn reset(
        &mut self,
        ft_contract_name: AccountId,
        num_of_tokens: WrappedBalance,
        start_time_iso8601: String,
        sale_duration_in_min: WrappedDuration,
        grace_duration_in_min: WrappedDuration,
        reset_deposit: bool,
        reset_redeem: bool,
    ) {
        assert!(env::state_exists(), "The contract is not initialized");
        self.assert_owner_id();

        self.ft_contract_name = ft_contract_name;
        self.num_of_tokens = num_of_tokens.into();
        self.start_time = {
            start_time_iso8601
            .parse::<DateTime<Utc>>()
            .unwrap().timestamp_nanos() as Timestamp
        };
        self.sale_duration = {let d: Duration = sale_duration_in_min.into(); d * 60 * 1_000_000_000};
        self.grace_duration = {let d: Duration = grace_duration_in_min.into(); d * 60 * 1_000_000_000};
        self.is_finished = false;
        if reset_deposit {
            self.deposit_map.clear();
        };
        if reset_redeem {
            self.redeemed_map.clear();
        };
    }

    pub fn change_owners(
        &mut self,
        owner_id: Option<AccountId>,
        sale_owner: Option<AccountId>,
    ) {
        self.assert_owner_id();
        if let Some(new_owner_id) = owner_id {
            self.owner_id = new_owner_id;
        }
        if let Some(new_sale_owner) = sale_owner {
            self.sale_owner = new_sale_owner;
        }
    }

    fn assert_owner_id(&self) {
        assert!(
            env::predecessor_account_id() == self.owner_id, 
            "Function called not from the contract owner",
        );
    }

    // reset redemption of a specific account. TODO: remove
    pub fn reset_redeem(&mut self, account_id: AccountId, value: u8) {
        assert!(env::state_exists(), "The contract is not initialized");
        self.assert_owner_id();
        self.redeemed_map.remove(&account_id);
        self.redeemed_map.insert(&account_id, &value);
    }

}