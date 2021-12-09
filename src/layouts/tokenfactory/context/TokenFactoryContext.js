/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import React, { createContext, useEffect } from "react";
import { TokenFactoryStore } from "../stores/TokenFactory.store";

const TokenFactoryContext = createContext();
const tokenFactoryStore = new TokenFactoryStore();
const TokenFactoryProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;

  tokenFactoryStore.setTokenStore(tokenStore);
  useEffect(async () => {
    await tokenFactoryStore.initContract();
    const lst = await tokenFactoryStore.getListToken();
    if (lst) {
      const mergeLst = await tokenFactoryStore.getDeployerState(lst);
      tokenFactoryStore.setRegisteredTokens(mergeLst);
    }
  }, [tokenStore.accountId]);
  return (
    <TokenFactoryContext.Provider
      value={{
        tokenFactoryStore,
      }}
    >
      {children}
    </TokenFactoryContext.Provider>
  );
};

export { TokenFactoryContext, TokenFactoryProvider };
