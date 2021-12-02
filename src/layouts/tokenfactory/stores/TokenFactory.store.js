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

  constructor() {
    makeAutoObservable(this);
  }

  setTokenStore = (tokenStore) => {
    this.tokenStore = tokenStore;
  };

  register = async () => {};

  createContract = async () => {};

  createDeployerContract = async () => {};

  issue = async () => {};

  initTokenAllocate = async () => {};
}
