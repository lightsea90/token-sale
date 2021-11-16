import React, { useState } from 'react'
import { createContext, useReducer, useEffect } from "react";
import getConfig from "../config";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import { TokenStore } from '../stores/Token.store';

// const initTokenState = {
//     walletConnection: null,
//     accountId: null,
//     contract: null
// };

// const initUserContract = {
//     userSale: null,
//     userPeriod: null
// };

// const initTokenContract = {
//     totalDeposit: 0,
//     tokenPeriod: null
// };

// const initTokenInfo = {
//     symbol: null,
//     decimals: 0
// };

const TokenSalesContext = createContext();
const tokenStore = new TokenStore();
const TokenSalesProvider = (props) => {
    const [tokenState, setTokenState] = useReducer((state, newState) => {
        return ({ ...state, ...newState });
    }, null);

    const [userContract, setUserContract] = useReducer((state, newState) => {
        return ({ ...state, ...newState });
    }, null);

    const [tokenContract, setTokenContract] = useReducer((state, newState) => {
        return ({ ...state, ...newState });
    }, null);

    const [isSignedIn, setIsSignedIn] = useState(false);

    const [showNotification, setShowNotification] = useState();

    const { children } = props;
    const nearConfig = getConfig(process.env.NODE_ENV || 'development');
    const nearUtils = utils;

    const initContract = async () => {
        // Initialize connection to the NEAR testnet
        const near = await connect(
            Object.assign(
                {
                    deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
                },
                nearConfig
            )
        );
        // Initializing Wallet based Account. It can work with NEAR testnet wallet that
        // is hosted at https://wallet.testnet.near.org
        const walletConnection = new WalletConnection(near);
        setIsSignedIn(walletConnection.isSignedIn());

        // Getting the Account ID. If still unauthorized, it's just empty string
        const accountId = walletConnection.getAccountId();

        // Initializing our contract APIs by contract name and configuration
        const contract = await new Contract(
            walletConnection.account(),
            nearConfig.contractName,
            {
                // View methods are read only. They don't modify the state, but usually return some value.
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

        setTokenState({
            walletConnection,
            accountId,
            contract
        });

        if (contract) {
            await fetchContractStatus(contract, walletConnection);
        }
        if (walletConnection.isSignedIn()) {
            await fetchUserData(contract);
        }
    };

    const initTokenContract = async (ftContractName, walletConnection) => {
        const tokenContract = await new Contract(
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
        return tokenContract;
    };

    const login = () => {
        // Allow the current app to make calls to the specified contract on the
        // user's behalf.
        // This works by creating a new access key for the user's account and storing
        // the private key in localStorage.
        const { walletConnection } = tokenState;
        walletConnection.requestSignIn(nearConfig.contractName);
    };

    const logout = () => {
        const { walletConnection } = tokenState;
        walletConnection.signOut();
        // window.location.replace(window.location.origin + window.location.pathname);
    };

    const fetchUserData = async (contract) => {
        const userSale = await contract.get_user_sale();
        setUserContract(userSale);
    };

    const fetchContractStatus = async (contract, walletConnection) => {
        try {
            const result = await Promise.all([contract.get_sale_info(), contract.get_total_deposit(), contract.check_sale_status()]);
            const saleInfo = result[0];
            const totalDeposit = result[1];
            const tokenPeriod = result[2];
            const tokenContract = await initTokenContract(saleInfo.ft_contract_name, walletConnection);

            const tokenInfo = await tokenContract.ft_metadata();
            // setTokenInfo(tokenInfo);

            setTokenContract({
                ...tokenContract, ...{
                    totalDeposit: totalDeposit,
                    tokenPeriod: tokenPeriod,
                    saleInfo: saleInfo,
                    tokenInfo: tokenInfo
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TokenSalesContext.Provider
            value={{
                tokenStore
            }}
        >
            {children}
        </TokenSalesContext.Provider>
    )
};

export { TokenSalesContext, TokenSalesProvider };