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

