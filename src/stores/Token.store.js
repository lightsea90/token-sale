import { makeAutoObservable, decorate, observable, action } from "mobx";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import { createContext, useContext } from "react";
import getConfig from "../config";

export class TokenStore {

    tokenState = null;
    userContract = null;
    tokenContract = null;
    nearUtils = utils;
    deposit = 0;
    withdraw = 0;
    redeem = 0;

    constructor() {
        makeAutoObservable(this);
        // nearConfig = getConfig(process.env.NODE_ENV || 'development');
        // nearUtils = utils;
    }

    async initContract() {
        // Initialize connection to the NEAR testnet
        const nearConfig = getConfig(process.env.NODE_ENV || 'development');
        const near = await connect(
            Object.assign(
                {
                    deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
                },
                nearConfig
            )
        );

        const walletConnection = new WalletConnection(near);
        // setIsSignedIn(walletConnection.isSignedIn());

        const accountId = walletConnection.getAccountId();

        const contract = await new Contract(
            walletConnection.account(),
            nearConfig.contractName,
            {
                viewMethods: [
                    "get_total_deposit",
                    "get_sale_info",
                    "check_sale_status",
                ],
                // Change methods can modify the state. But you don't receive the returned value when called.
                changeMethods: [
                    "deposit", "withdraw",
                    "finish", "redeem",
                    "get_user_sale",
                ],
            }
        );

        this.tokenState = {
            walletConnection,
            accountId,
            contract
        };

        if (contract) {
            await  this.fetchContractStatus(contract, walletConnection);
        }
        if (walletConnection.isSignedIn()) {
            await this.fetchUserData(contract);
        }
    };

    async initTokenContract(ftContractName, walletConnection) {
        this.tokenContract = await new Contract(
            walletConnection.account(),
            ftContractName,
            {
                // View methods are read only. They don't modify the state, but usually return some value.
                viewMethods: [
                    "ft_metadata", "ft_balance_of", "storage_balance_of",
                ],
                // Change methods can modify the state. But you don't receive the returned value when called.
                changeMethods: [
                    "ft_transfer", "storage_deposit",
                ],
            }
        );
    };

    async fetchUserData(contract) {
        this.userContract = await contract.get_user_sale();
    };

    async fetchContractStatus(contract, walletConnection) {
        try {
            const result = await Promise.all([contract.get_sale_info(), contract.get_total_deposit(), contract.check_sale_status()]);
            const saleInfo = result[0];
            const totalDeposit = result[1];
            const tokenPeriod = result[2];
            await this.initTokenContract(saleInfo.ft_contract_name, walletConnection);

            const tokenInfo = await this.tokenContract.ft_metadata();
            this.tokenContract = {
                ...this.tokenContract, ...{
                    totalDeposit: totalDeposit,
                    tokenPeriod: tokenPeriod,
                    saleInfo: saleInfo,
                    tokenInfo: tokenInfo
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    login() {
        // Allow the current app to make calls to the specified contract on the
        // user's behalf.
        // This works by creating a new access key for the user's account and storing
        // the private key in localStorage.
        const nearConfig = getConfig(process.env.NODE_ENV || 'development');
        const { walletConnection } = this.tokenState;
        walletConnection.requestSignIn(this.nearConfig.contractName);
    };

    logout() {
        const { walletConnection } = this.tokenState;
        walletConnection.signOut();
        // window.location.replace(window.location.origin + window.location.pathname);
    };
}
// decorate(TokenStore, {
//     tokenState: observable,
//     userContract: observable,
//     tokenContract: observable,
//     deposit: observable,
//     withdraw: observable,
//     redeem: observable,

//     initContract: action,
//     initTokenContract: action,
//     fetchUserData: action,
//     fetchContractStatus: action,
//     login: action,
//     logout: action
// });

// const TokenStoreContext = createContext(new TokenStore());
// export const useTokenStore = () => useContext(TokenStoreContext);

