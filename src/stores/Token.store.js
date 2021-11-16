import { observable, action, makeObservable, computed, makeAutoObservable } from "mobx";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import getConfig from "../config";
import { NotificationType } from "../constants/NotificationType"

export class NotificationObj {
    type = NotificationType.SUCCESS;
    message = '';
    show = false;
    constructor() {
        makeAutoObservable(this);
    }
}
export class TokenStore {

    tokenState = null;
    userContract = null;
    tokenContract = null;
    isSignedIn = false;
    nearUtils = utils;
    deposit = 0;
    withdraw = 0;
    redeem = 0;
    DEFAULT_GAS = 300000000000000;
    DEFAULT_STORAGE_DEPOSIT = 0.00125;
    nearConfig = getConfig(process.env.NODE_ENV || 'development');
    notification = new NotificationObj();

    constructor() {
        // makeAutoObservable(this);
        makeObservable(this, {
            tokenState: observable,
            userContract: observable,
            tokenContract: observable,
            isSignedIn: observable,
            nearUtils: observable,
            deposit: observable,
            withdraw: observable,
            redeem: observable,
            notification: observable,

            initContract: action,
            initTokenContract: action,
            fetchUserData: action,
            fetchContractStatus: action,
            login: action,
            logout: action,

            period: computed
        });
    }

    initContract = async () => {
        // Initialize connection to the NEAR testnet
        const near = await connect(
            Object.assign(
                {
                    deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
                },
                this.nearConfig
            )
        );

        const walletConnection = new WalletConnection(near);
        this.isSignedIn = walletConnection.isSignedIn();

        const accountId = walletConnection.getAccountId();

        const contract = await new Contract(
            walletConnection.account(),
            this.nearConfig.contractName,
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
            await this.fetchContractStatus(contract, walletConnection);
        }
        if (walletConnection.isSignedIn()) {
            await this.fetchUserData(contract);
        }
    };

    initTokenContract = async (ftContractName, walletConnection) => {
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

    fetchUserData = async (contract) => {
        this.notification = {
            type: NotificationType.WARNING,
            message: 'Waiting for transaction...',
            show: true
        };
        this.userContract = await contract.get_user_sale();
        this.notification.show = false;
    };

    fetchContractStatus = async (contract, walletConnection) => {
        try {
            const result = await Promise.all([contract.get_sale_info(), contract.get_total_deposit(), contract.check_sale_status()]);
            const saleInfo = result[0];
            const totalDeposit = result[1];
            const tokenPeriod = result[2];
            const tokenContract = await this.initTokenContract(saleInfo.ft_contract_name, walletConnection);

            const tokenInfo = await tokenContract.ft_metadata();
            this.tokenContract = {
                ...tokenContract, ...{
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

    login = () => {
        // Allow the current app to make calls to the specified contract on the
        // user's behalf.
        // This works by creating a new access key for the user's account and storing
        // the private key in localStorage.
        const { walletConnection } = this.tokenState;
        walletConnection.requestSignIn(this.nearConfig.contractName);
    };

    logout = () => {
        const { walletConnection } = this.tokenState;
        walletConnection.signOut();
        this.isSignedIn = walletConnection.isSignedIn();
    };

    submitDeposit = async () => {
        const { contract } = this.tokenContract;
        try {
            const nearAmount = this.nearUtils.format.parseNearAmount(this.deposit);
            const res = await contract.deposit({}, this.DEFAULT_GAS, nearAmount);
            this.userContract.deposit += this.deposit;
        } catch (error) {

        } finally {

        }
    };
    submitWithdraw = () => { };
    submitRedeem = () => { };

    get period() {
        if (this.tokenContract?.saleInfo?.start_time) {
            const startTime = this.tokenContract.saleInfo.start_time / 1000000;
            const saleDuration = this.tokenContract.saleInfo.sale_duration / 1000000;
            const graceDuration = this.tokenContract.saleInfo.grace_duration / 1000000;
            const current = new Date().getTime();
            if (current < startTime) {
                return "NOT_STARTED";
            } else if (current <= startTime + saleDuration) {
                return "ON_SALE";
            } else if (current <= startTime + saleDuration + graceDuration) {
                return "ON_GRACE";
            } else {
                return "FINISHED";
            }
        }
        return null;
    }

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

