import {
  observable,
  action,
  makeObservable,
  computed,
  makeAutoObservable,
  when,
  reaction,
} from "mobx";
import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  utils,
} from "near-api-js";
import getConfig from "../config";
import { NotificationType } from "../constants/NotificationType";
import moment from "moment";

export class NotificationObj {
  type = NotificationType.INFO;
  message = "";
  show = false;
  constructor() {
    makeAutoObservable(this);
  }
}
export class TokenState {
  walletConnection = null;
  contract = null;
  accountId = null;
  constructor() {
    makeAutoObservable(this);
  }
}
export class TokenContract {
  totalDeposit = null;
  tokenPeriod = null;
  saleInfo = null;
  tokenInfo = null;
  constructor() {
    makeAutoObservable(this);
  }
}
export class TokenStore {
  tokenState = new TokenState();
  userContract = null;
  tokenContract = new TokenContract();
  isSignedIn = false;
  nearUtils = utils;
  deposit = 0;
  withdraw = 0;
  redeem = 0;
  DEFAULT_GAS = 300000000000000;
  DEFAULT_STORAGE_DEPOSIT = 0.00125;
  nearConfig = getConfig(process.env.NODE_ENV || "development");
  notification = new NotificationObj();
  loading = false;
  countdownStart = 0;
  countdownGrace = 0;
  countdownRedeem = 0;
  // period = '';

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
      loading: observable,
      countdownStart: observable,
      countdownGrace: observable,
      countdownRedeem: observable,

      initContract: action,
      initTokenContract: action,
      fetchUserData: action,
      fetchContractStatus: action,
      login: action,
      logout: action,
      submitDeposit: action,
      submitWithdraw: action,
      submitRedeem: action,
      getCountdownStart: action,
      getCountdownGrace: action,
      getCountdownRedeem: action,

      period: computed,
      depositTime: computed,
      withdrawalTime: computed,
      redeemTime: computed,
      // countDownDeposit: computed,
      // countDownWithdraw: computed,
      // countDownRedeem: computed
    });
    reaction(
      () => this.tokenContract,
      (tokenContract) => {
        this.countdownStart = this.getCountdownStart(tokenContract);
        this.countdownGrace = this.getCountdownGrace(tokenContract);
        this.countdownRedeem = this.getCountdownRedeem(tokenContract);
      }
    );
  }

  initContract = async () => {
    // Initialize connection to the NEAR testnet
    try {
      const near = await connect(
        Object.assign(
          {
            deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
          },
          this.nearConfig
        )
      );

      const walletConnection = new WalletConnection(near, "");
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
            "deposit",
            "withdraw",
            "finish",
            "redeem",
            "get_user_sale",
          ],
        }
      );

      this.tokenState = {
        walletConnection,
        accountId,
        contract,
      };

      if (contract) {
        await this.fetchContractStatus(contract, walletConnection);
      }
      if (walletConnection.isSignedIn()) {
        await this.fetchUserData(contract);
      }
    } catch (error) {
      console.log(error);
    }
  };

  initTokenContract = async (ftContractName, walletConnection) => {
    try {
      const tokenContract = await new Contract(
        walletConnection.account(),
        ftContractName,
        {
          // View methods are read only. They don't modify the state, but usually return some value.
          viewMethods: ["ft_metadata", "ft_balance_of", "storage_balance_of"],
          // Change methods can modify the state. But you don't receive the returned value when called.
          changeMethods: ["ft_transfer", "storage_deposit"],
        }
      );
      return tokenContract;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  fetchUserData = async (contract) => {
    this.notification = {
      type: NotificationType.INFO,
      message: "Waiting for transaction...",
      show: true,
    };
    try {
      this.userContract = await contract.get_user_sale();
    } catch (error) {
      console.log(error);
    }
    this.notification.show = false;
  };

  fetchContractStatus = async (contract, walletConnection) => {
    try {
      const result = await Promise.all([
        contract.get_sale_info(),
        contract.get_total_deposit(),
        contract.check_sale_status(),
      ]);
      const saleInfo = result[0];
      const totalDeposit = result[1];
      const tokenPeriod = result[2];
      const tokenContract = await this.initTokenContract(
        saleInfo.ft_contract_name,
        walletConnection
      );

      const tokenInfo = await tokenContract.ft_metadata();
      this.tokenContract = {
        ...tokenContract,
        ...{
          totalDeposit: totalDeposit,
          tokenPeriod: tokenPeriod,
          saleInfo: saleInfo,
          tokenInfo: tokenInfo,
        },
      };
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
    const { contract } = this.tokenState;
    try {
      this.notification = {
        type: NotificationType.INFO,
        message: "Waiting for transaction deposit...",
        show: true,
      };
      const nearAmount = this.nearUtils.format.parseNearAmount(this.deposit.toString());
      // console.log(nearAmount);
      const res = await contract.deposit({}, this.DEFAULT_GAS, nearAmount);
      // this.userContract.deposit += this.deposit;
      console.log(res);
    } catch (error) {
      this.notification = {
        ...this.notification,
        ...{
          type: NotificationType.ERROR,
          message: error,
          show: true,
        },
      };
    } finally {
      this.fetchUserData(this.tokenState.contract);
    }
  };

  submitWithdraw = async () => {
    const { contract } = this.tokenState;
    try {
      this.notification = {
        type: NotificationType.INFO,
        message: "Waiting for transaction withdrawal...",
        show: true,
      };
      const nearAmount = this.nearUtils.format.parseNearAmount(this.withdraw.toString());
      console.log(nearAmount);
      const res = await contract.withdraw(
        { amount: nearAmount },
        this.DEFAULT_GAS
      );
      if (res) {
        this.notification = {
          ...this.notification,
          ...{
            type: NotificationType.SUCCESS,
            message: "Withdrawal SUCCESS",
            show: true,
          },
        };
      } else {
        this.notification = {
          ...this.notification,
          ...{
            type: NotificationType.ERROR,
            message: "Withdrawal FAIL",
            show: true,
          },
        };
      }
    } catch (error) {
      console.log(error);
      this.notification = {
        type: NotificationType.ERROR,
        message: error.message,
        show: true,
      };
    } finally {
      this.fetchUserData(this.tokenState.contract);
    }
  };

  submitRedeem = async () => {
    try {
      const { contract } = this.tokenState;
      const storageDeposit = await this.tokenContract.storage_balance_of({
        account_id: this.tokenState.accountId,
      });
      if (storageDeposit === null) {
        const storageDeposit = await this.tokenContract.storage_deposit(
          {},
          this.DEFAULT_GAS,
          this.nearUtils.format.parseNearAmount(
            this.DEFAULT_STORAGE_DEPOSIT.toString()
          )
        );
        console.log(storageDeposit);
      }
      this.notification = {
        type: NotificationType.INFO,
        message: "Waiting for transaction redeem...",
        show: true,
      };
      const res = await contract.redeem({}, this.DEFAULT_GAS);
      if (res) {
        this.notification = {
          type: NotificationType.SUCCESS,
          message: "Redeem SUCCESS",
          show: true,
        };
      } else {
        this.notification = {
          type: NotificationType.ERROR,
          message: "Redeem FAIL",
          show: true,
        };
      }
    } catch (error) {
      console.log(error);
      this.notification = {
        type: NotificationType.ERROR,
        message: error.message,
        show: true,
      };
    } finally {
      this.fetchUserData(this.tokenState.contract);
    }
  };

  get period() {
    if (this.tokenContract?.saleInfo?.start_time) {
      const startTime = this.tokenContract.saleInfo.start_time / 1000000;
      const saleDuration = this.tokenContract.saleInfo.sale_duration / 1000000;
      const graceDuration =
        this.tokenContract.saleInfo.grace_duration / 1000000;
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
  };

  getCountdownStart = (tokenContract) => {
    if (tokenContract?.saleInfo) {
      const startTime = tokenContract?.saleInfo?.start_time / 1000000;
      return (startTime - new Date().getTime()) / 1000;
    }
    return -1;
  };

  getCountdownGrace = (tokenContract) => {
    if (tokenContract?.saleInfo) {
      const startTime = tokenContract.saleInfo.start_time / 1000000;
      const saleDuration = tokenContract.saleInfo.sale_duration / 1000000;
      return (startTime + saleDuration - new Date().getTime()) / 1000;
    }
    return -1;
  };

  getCountdownRedeem = (tokenContract) => {
    if (tokenContract?.saleInfo) {
      const startTime = tokenContract.saleInfo.start_time / 1000000;
      const saleDuration = tokenContract.saleInfo.sale_duration / 1000000;
      const graceDuration = tokenContract.saleInfo.grace_duration / 1000000;
      return (
        (startTime + saleDuration + graceDuration - new Date().getTime()) / 1000
      );
    }
    return -1;
  };

  get depositTime() {
    if (this.tokenContract?.saleInfo) {
      const startTime = this.tokenContract?.saleInfo?.start_time / 1000000;
      return moment(startTime).format("YYYY-MM-DD HH:mm:ss");
    }
    return -1;
  };

  get withdrawalTime() {
    if (this.tokenContract?.saleInfo) {
      const startTime = this.tokenContract?.saleInfo?.start_time / 1000000;
      const saleDuration = this.tokenContract.saleInfo.sale_duration / 1000000;
      return moment(startTime + saleDuration).format("YYYY-MM-DD HH:mm:ss");
    }
    return -1;
  };

  get redeemTime() {
    if (this.tokenContract?.saleInfo) {
      const startTime = this.tokenContract?.saleInfo?.start_time / 1000000;
      const saleDuration = this.tokenContract.saleInfo.sale_duration / 1000000;
      const graceDuration =
        this.tokenContract.saleInfo.grace_duration / 1000000;
      return moment(startTime + saleDuration + graceDuration).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    return -1;
  };
}
