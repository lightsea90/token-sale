import React from 'react'
import { createContext, useReducer, useEffect } from "react";
import getConfig from "../config";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";

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
        if (contract) {
            await fetchContractStatus(contract);
        }

        setTokenState({
            walletConnection,
            accountId,
            contract
        });
    };

    const initTokenContract = async (ftContractName) => {
        const { walletConnection } = tokenState;
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

    const fetchUserData = async () => {
        const { contract } = tokenState;
        const userSale = await contract.get_user_sale();
        setUserContract(userSale);
    };

    const fetchContractStatus = async (contract) => {
        try {
            const result = await Promise.all([contract.get_sale_info(), contract.get_total_deposit(), contract.check_sale_status()]);
            const saleInfo = result[0];
            const totalDeposit = result[1];
            const tokenPeriod = result[2];
            const tokenContract = await initTokenContract(saleInfo.ft_contract_name);

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

    // useEffect(async () => {
    //     if (tokenState) {
    //         const { contract } = tokenState;
    //         if (contract) {
    //             await fetchContractStatus(contract);
    //         }
    //     }
    // }, [tokenState]);

    return (
        <TokenSalesContext.Provider
            value={{
                tokenState,
                tokenContract,
                userContract,
                nearUtils,
                setTokenState,
                setTokenContract,
                setUserContract,
                initContract,
                initTokenContract,
                fetchContractStatus,
                fetchUserData,
                login,
                logout
            }}
        >
            {children}
        </TokenSalesContext.Provider>
    )
};

export { TokenSalesContext, TokenSalesProvider };