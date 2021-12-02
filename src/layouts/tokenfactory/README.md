# register
export current=$(date +%s)
$ near call token-factory.tokenhub.testnet --accountId harrynguyen005.testnet register '{
    "ft_contract": "test003.token-factory.tokenhub.testnet", 
    "deployer_contract": "test003-deployer.token-factory.tokenhub.testnet",
    "total_supply": "100000000000000000",
    "token_name": "test003 name",
    "symbol": "test003",
    "decimals": 8,
    "initial_release": "20000000000000000",
    "vesting_start_time": "'$((current+5*60))000000000'",
    "vesting_end_time": "'$((current+15*60))000000000'",
    "vesting_interval": "'$((5*60))000000000'",
    "treasury_allocation": "10000000000000000"
}' --deposit 8

# deploy ft contract
$ near call token-factory.tokenhub.testnet --accountId harrynguyen005.testnet create_ft_contract '{
    "ft_contract": "test003.token-factory.tokenhub.testnet"
}' --gas 60000000000000

# deploy ft deployer contract
$ near call token-factory.tokenhub.testnet --accountId harrynguyen005.testnet create_deployer_contract '{
    "ft_contract": "test003.token-factory.tokenhub.testnet"
}' --gas 60000000000000

# issue token
$ near call token-factory.tokenhub.testnet --accountId harrynguyen005.testnet issue_ft '{
    "ft_contract": "test003.token-factory.tokenhub.testnet"
}' --gas 60000000000000

# setup token allocation
$ near call token-factory.tokenhub.testnet --accountId harrynguyen005.testnet init_token_allocation '{
    "ft_contract": "test003.token-factory.tokenhub.testnet"
}' --gas 60000000000000

# check token state
$ near view token-factory.tokenhub.testnet get_token_state '{
    "ft_contract": "test003.token-factory.tokenhub.testnet"
}'

# storage deposit
near call test003.token-factory.tokenhub.testnet storage_deposit '' --accountId harrynguyen005.testnet --amount 0.00125

# claim
$ near call test003-deployer.token-factory.tokenhub.testnet claim --accountId harrynguyen005.testnet --gas 60000000000000