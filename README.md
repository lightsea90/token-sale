Token Sale
==================

This is a smart contract running on NEAR Protocol. It could be used to run a token sale.

# Sale rules
* There are 2 periods: Sale and Grace.
* In Sale period: users can deposit and withdraw.
* In Grace period: users can only withdraw.
* At any point of time, the price is calculated by the total deposit divided by the total number of tokens for sale.
* After the grace period ends, the sale finishes and the price is finalized.
* At that point, tokens are allocated to users based on their deposit. Users can redeem to their wallets.

near call akux.sales.tokenhub.testnet new '{
        "owner_id": "liamenguyen.testnet",
        "ft_contract_name": "akux.harrynguyen.testnet",
        "num_of_tokens": 10000000000000,
        "start_time_iso8601": "",
        "sale_duration_in_min": "WrappedDuration",
        "grace_duration_in_min": "WrappedDuration",
        "sale_owner": "AccountId",
}' --accountId harrynguyen.testnet

export date="$(date --iso-8601=seconds --date='+2 minutes')"
near call --accountId harrynguyen.testnet akux.sales.tokenhub.testnet new '{
    "owner_id": "liamenguyen.testnet",
    "ft_contract_name":"akux.harrynguyen.testnet",
    "num_of_tokens":"10000000000000",
    "start_time_iso8601":"'${date}'",
    "sale_duration_in_min":"1440",
    "grace_duration_in_min":"1440",
    "sale_owner": "liamenguyen1.testnet"
}'

export date="$(date --iso-8601=seconds --date='+2 minutes')"
near call --accountId harrynguyen.testnet akux.sales.tokenhub.testnet reset '{
    "ft_contract_name":"akux.harrynguyen.testnet",
    "num_of_tokens":"10000000000000",
    "start_time_iso8601":"'${date}'",
    "sale_duration_in_min":"1440",
    "grace_duration_in_min":"1440",
    "reset_deposit":true,"reset_redeem":true
}'