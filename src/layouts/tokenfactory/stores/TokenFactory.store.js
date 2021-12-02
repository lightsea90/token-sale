// eslint-disable-next-line import/prefer-default-export
// eslint-disable-next-line max-classes-per-file
import { makeAutoObservable } from "mobx";

export class Token {
  tokenName = "";
  symbol = "";
  initialSupply = 1000000000;
  decimal = 8;
  
  constructor() {
    makeAutoObservable(this);
  }
}

export class TokenFactoryStore {
  // step = [
  //   register : {},
  //   createContract : {},
  //   createDeployerContract : {},
  //   issue : {},
  // ]  
  token = new Token();
  activeStep;
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
          changeMethods: ["register", "create_ft_contract", "create_deployer_contract", "issue_ft", "init_token_allocation"],
        }
      );
      this.contract = contract;
    } catch (error) {
      console.log(error);
    }
  };

  register = async () => {
    return await this.contract.register(registerParams);
  };

  createContract = async () => {
    return await this.contract.create_ft_contract(this.registerParams.ft_contract);
  };

  createDeployerContract = async () => {
    return await this.contract.create_deployer_contract(this.registerParams.ft_contract);
  };

  issue = async () => {
    return await this.contract.issue_ft(this.registerParams.ft_contract);
  };

  initTokenAllocation = async () => {
    return await this.contract.init_token_allocation(this.registerParams.ft_contract);
  };

  getTokenState = async () => {
    return await this.contract.get_token_state(this.registerParams.ft_contract);
  }

  get registerParams() {
    return {
      "ft_contract": `${this.token.symbol}.token-factory.tokenhub.testnet`,
      "deployer_contract": `${this.token.symbol}-deployer.token-factory.tokenhub.testnet`,
      "total_supply": this.token.initialSupply,
      "token_name": this.token.tokenName,
      "symbol": this.token.symbol,
      "decimals": this.token.decimal,
    };
  }
}
