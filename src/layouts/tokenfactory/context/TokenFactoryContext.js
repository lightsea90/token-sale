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
    const lst = await Promise.all([
      tokenFactoryStore.getListToken(),
      tokenFactoryStore.getListAllTokens(),
    ]);
    if (lst) {
      const lstMyToken = lst[0];
      const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
      tokenFactoryStore.setRegisteredTokens(mergeLst);

      tokenFactoryStore.setAllTokens(lst[1]);
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
