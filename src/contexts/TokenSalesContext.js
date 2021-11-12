import { createContext, useReducer } from "react";
import getConfig from "../config";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import { async } from "regenerator-runtime";

const initState = {
    walletConnection,
    accountId,
    contract,
    tokenContract,
};

const TokenSalesContext = createContext(initState);

const TokenSalesProvider = (props) => {
    const [tokenState, setTokenState] = useReducer((state, newState) => {
        return ({ ...state, ...newState });
    }, initState);
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
        setTokenState({ tokenContract });
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
    }

    return (
        <TokenSalesContext.Provider
            value={{
                tokenState,
                setTokenState,
                nearUtils,
                initContract,
                initTokenContract,
                login,
                logout
            }}
        >
            {children}
        </TokenSalesContext.Provider>
    )
};

export { TokenSalesContext, TokenSalesProvider };