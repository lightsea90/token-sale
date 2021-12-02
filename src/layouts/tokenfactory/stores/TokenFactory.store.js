// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line max-classes-per-file
import Shop from "examples/Icons/Shop";
// import { getTokenFactoryConfig } from "layouts/tokensales/config";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import { Contract } from "near-api-js";

export const TOKEN_FACTORY_STEP = {
  REGISTER: "register",
  CREATE_FT_CONTRACT: "create_ft_contract",
  CREATE_DEPLOYER_CONTRACT: "create_deployer_contract",
  ISSUE_FT: "issue_ft",
  INIT_TOKEN_ALLOCATION: "init_token_allocation",
};

export class Token {
  // tokenFactoryConfig = getTokenFactoryConfig(process.env.NODE_ENV || "development");

  tokenName = "Token test";

  symbol = "TESTT";

  initialSupply = 1000000000;

  decimal = 8;

  initialRelease = 15;

  treasury = 8;

  vestingStartTime = new Date();

  vestingEndTime = new Date();

  vestingInterval = 1;

  constructor() {
    makeAutoObservable(this);
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

  DEFAULT_GAS = 600000000000000;

  token = new Token();

  activeStep = -1;

  tokenStore;

  contract;

  constructor() {
    makeAutoObservable(this);
  }

  setTokenStore = (tokenStore) => {
    this.tokenStore = tokenStore;
  };

  initContract = async () => {
    try {
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
    const value = await this.contract.register(
      this.registerParams,
      this.DEFAULT_GAS,
      this.tokenStore.nearUtils.format.parseNearAmount(4)
    );
    console.log("register : ", value);
    return value;
  };

  createContract = async () => {
    this.activeStep = 1;
    const value = await this.contract.create_ft_contract(
      this.registerParams.ft_contract,
      this.DEFAULT_GAS
    );
    console.log("create_ft_contract : ", value);
    return value;
  };

  createDeployerContract = async () => {
    this.activeStep = 2;
    const value = await this.contract.create_deployer_contract(
      this.registerParams.ft_contract,
      this.DEFAULT_GAS
    );
    console.log("create_deployer_contract : ", value);
    return value;
  };

  issue = async () => {
    this.activeStep = 3;
    const value = await this.contract.issue_ft(this.registerParams.ft_contract, this.DEFAULT_GAS);
    console.log("issue_ft : ", value);
    return value;
  };

  initTokenAllocation = async () => {
    this.activeStep = 4;
    const value = await this.contract.init_token_allocation(
      this.registerParams.ft_contract,
      this.DEFAULT_GAS
    );
    console.log("init_token_allocation : ", value);
    return value;
  };

  getTokenState = async () => {
    const value = await this.contract.get_token_state(this.registerParams.ft_contract);
    console.log("get_token_state : ", value);
    return value;
  };

  get registerParams() {
    return {
      ft_contract: `${this.token.symbol}.token-factory.tokenhub.testnet`,
      deployer_contract: `${this.token.symbol}-deployer.token-factory.tokenhub.testnet`,
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
