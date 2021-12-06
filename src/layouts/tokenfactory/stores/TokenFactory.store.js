// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line max-classes-per-file
import Shop from "examples/Icons/Shop";
// import { getTokenFactoryConfig } from "layouts/tokensales/config";
import { action, autorun, computed, makeObservable, observable } from "mobx";
import moment from "moment";
import { Contract, providers } from "near-api-js";
import {
  LOCAL_STORAGE_CURRENT_TOKEN,
  LOCAL_STORAGE_REGISTERED_TOKEN,
} from "../constants/TokenFactory";

export const TOKEN_FACTORY_STEP = {
  REGISTER: "register",
  CREATE_FT_CONTRACT: "create_ft_contract",
  CREATE_DEPLOYER_CONTRACT: "create_deployer_contract",
  ISSUE_FT: "issue_ft",
  INIT_TOKEN_ALLOCATION: "init_token_allocation",
};

export class Token {
  // tokenFactoryConfig = getTokenFactoryConfig(process.env.NODE_ENV || "development");

  tokenName = "";

  symbol = "";

  initialSupply = 1000000000;

  decimal = 8;

  initialRelease = 15;

  treasury = 8;

  vestingStartTime = new Date();

  vestingEndTime = moment().add(30, "day");

  vestingInterval = 1;

  constructor() {
    makeObservable(this, {
      tokenName: observable,
      symbol: observable,
      initialSupply: observable,
      decimal: observable,
      initialRelease: observable,
      treasury: observable,
      vestingStartTime: observable,
      vestingEndTime: observable,
      vestingInterval: observable,
    });
  }
}

export class TokenFactoryStore {
  steps = [
    {
      name: "Register",
      key: TOKEN_FACTORY_STEP.REGISTER,
      icon: <Shop size="14px" />,
    },
    {
      name: "Create contract",
      key: TOKEN_FACTORY_STEP.CREATE_FT_CONTRACT,
      icon: <Shop size="14px" />,
    },
    {
      name: "Create deployer contract",
      key: TOKEN_FACTORY_STEP.CREATE_DEPLOYER_CONTRACT,
      icon: <Shop size="14px" />,
    },
    {
      name: "Issue",
      key: TOKEN_FACTORY_STEP.ISSUE_FT,
      icon: <Shop size="14px" />,
    },
    {
      name: "Init token allocation",
      key: TOKEN_FACTORY_STEP.INIT_TOKEN_ALLOCATION,
      icon: <Shop size="14px" />,
    },
  ];

  DEFAULT_GAS = 300000000000000;

  DEFAULT_STORAGE_DEPOSIT = 0.00125;

  DEFAULT_NEAR_AMOUNT = "8";

  token = new Token();

  activeStep = -1;

  tokenStore;

  registeredTokens = [];

  tokenContract;

  constructor() {
    // makeAutoObservable(this);
    makeObservable(this, {
      steps: observable,
      token: observable,
      activeStep: observable,
      registeredTokens: observable,
      // tokenContract: observable,

      setRegisteredTokens: action,
      initContract: action,
      setToken: action,
      register: action,
      createContract: action,
      createDeployerContract: action,
      issue: action,
      initTokenAllocation: action,
      getTokenState: action,
      appendRegisteredToken: action,
      // initTokenContract: action,
      claim: action,
      getTransactionStatus: action,
      registerParams: computed,
    });
    autorun(() => {
      console.log("Write local");
      localStorage.setItem(LOCAL_STORAGE_REGISTERED_TOKEN, JSON.stringify(this.registeredTokens));
    });
  }

  setTokenStore = (tokenStore) => {
    this.tokenStore = tokenStore;
  };

  setRegisteredTokens = (lst) => {
    this.registeredTokens = lst;
  };

  initContract = async () => {
    try {
      if (!this.tokenStore.walletConnection) {
        await this.tokenStore.initWalletConnection();
      }
      const contract = await new Contract(
        this.tokenStore.walletConnection.account(),
        this.tokenStore.nearConfig.contractName,
        {
          viewMethods: ["get_token_state"],
          // Change methods can modify the state. But you don't receive the returned value when called.
          changeMethods: [
            "register",
            "create_ft_contract",
            "create_deployer_contract",
            "issue_ft",
            "init_token_allocation",
          ],
        }
      );
      this.contract = contract;
    } catch (error) {
      console.log(error);
    }
  };

  setToken = (obj) => {
    this.token = { ...this.token, ...obj };
  };

  register = async () => {
    this.activeStep = 0;
    console.log(this.contract);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_TOKEN, JSON.stringify(this.token));

    const value = await this.contract.register(
      this.registerParams,
      this.DEFAULT_GAS,
      this.tokenStore.nearUtils.format.parseNearAmount(this.DEFAULT_NEAR_AMOUNT)
    );
    console.log("register : ", value);
    return value;
  };

  createContract = async () => {
    this.activeStep = 1;
    const value = await this.contract.create_ft_contract(this.registerParams, this.DEFAULT_GAS);
    console.log("create_ft_contract : ", value);
    const current = { ...{}, ...this.registerParams };
    current.create_ft_contract = value;
    this.appendRegisteredToken(current);
    return value;
  };

  createDeployerContract = async () => {
    this.activeStep = 2;
    const value = await this.contract.create_deployer_contract(
      this.registerParams,
      this.DEFAULT_GAS
    );
    console.log("create_deployer_contract : ", value);
    const current = { ...{}, ...this.registerParams };
    current.create_deployer_contract = value;
    this.appendRegisteredToken(current);
    return value;
  };

  issue = async () => {
    this.activeStep = 3;
    const value = await this.contract.issue_ft(this.registerParams, this.DEFAULT_GAS);
    console.log("issue_ft : ", value);
    const current = { ...{}, ...this.registerParams };
    current.issue_ft = value;
    this.appendRegisteredToken(current);
    return value;
  };

  initTokenAllocation = async () => {
    this.activeStep = 4;
    const value = await this.contract.init_token_allocation(this.registerParams, this.DEFAULT_GAS);
    console.log("init_token_allocation : ", value);
    const current = { ...{}, ...this.registerParams };
    current.init_token_allocation = value;
    this.appendRegisteredToken(current);
    this.activeStep = -1;
    this.setToken(new Token());
    this.clearLocalStorageToken();
    return value;
  };

  getTokenState = async () => {
    const value = await this.contract.get_token_state(this.registerParams);
    console.log("get_token_state : ", value);
    return value;
  };

  appendRegisteredToken = (current) => {
    const tokenIndex = this.registeredTokens.findIndex((t) => t.symbol === current.symbol);

    if (tokenIndex > -1)
      this.registeredTokens[tokenIndex] = { ...this.registeredTokens[tokenIndex], ...current };
    else this.registeredTokens.push(current);
  };

  clearLocalStorageToken = () => {
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_TOKEN);
  };

  initTokenContract = async (ftContractName, viewMethods, changeMethods) => {
    try {
      const tokenContract = await new Contract(
        this.tokenStore.walletConnection.account(),
        ftContractName,
        {
          // View methods are read only. They don't modify the state, but usually return some value.
          viewMethods,
          // Change methods can modify the state. But you don't receive the returned value when called.
          changeMethods,
        }
      );
      return tokenContract;
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  claim = async (token) => {
    const tokenContract = await this.initTokenContract(
      token.ft_contract,
      ["ft_metadata", "ft_balance_of", "storage_balance_of"],
      ["ft_transfer", "storage_deposit"]
    );
    const deployerContract = await this.initTokenContract(token.deployer_contract, [], ["claim"]);
    try {
      if (tokenContract) {
        let storageDeposit = await tokenContract.storage_balance_of({
          account_id: this.tokenStore.accountId,
        });
        if (storageDeposit === null) {
          storageDeposit = await tokenContract.storage_deposit(
            {},
            this.DEFAULT_GAS,
            this.tokenStore.nearUtils.format.parseNearAmount(
              this.DEFAULT_STORAGE_DEPOSIT.toString()
            )
          );
          console.log(storageDeposit);
        }
        const res = await deployerContract.claim({}, this.DEFAULT_GAS);
        return res;
      }
    } catch (error) {
      console.log("Claim : ", error);
    }
    return null;
  };

  getTransactionStatus = async (txHash) => {
    const provider = new providers.JsonRpcProvider("https://archival-rpc.testnet.near.org");
    const res = await provider.txStatus(txHash, this.tokenStore.accountId);
    console.log(res);
    return res;
  };

  get registerParams() {
    return {
      ft_contract: `${this.token.symbol}.token-factory.tokenhub.testnet`.toLowerCase(),
      deployer_contract:
        `${this.token.symbol}-deployer.token-factory.tokenhub.testnet`.toLowerCase(),
      total_supply: (this.token.initialSupply * 10 ** this.token.decimal).toString(),
      token_name: this.token.tokenName,
      symbol: this.token.symbol,
      decimals: this.token.decimal,
      initial_release: (
        this.token.initialSupply *
        10 ** this.token.decimal *
        (this.token.initialRelease / 100)
      ).toString(),
      treasury_allocation: (
        this.token.initialSupply *
        10 ** this.token.decimal *
        (this.token.treasury / 100)
      ).toString(),
      vesting_start_time: (moment(this.token.vestingStartTime).unix() * 10 ** 9).toString(),
      vesting_end_time: (moment(this.token.vestingEndTime).unix() * 10 ** 9).toString(),
      vesting_interval: (this.token.vestingInterval * 24 * 3600 * 10 ** 9).toString(),
    };
  }
}
