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
    try {
      // const lst = await Promise.all([
      //   tokenFactoryStore.getListToken(),
      //   tokenFactoryStore.getListAllTokens(),
      // ]);

      // if (lst) {
      //   if (lst?.length > 0) {
      //     const lstMyToken = lst[0];
      //     const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
      //     tokenFactoryStore.setRegisteredTokens(mergeLst);
      //   }

      //   if (lst?.length > 1) tokenFactoryStore.setAllTokens(lst[1]);
      // }
      const lstMyTokens = await tokenFactoryStore.getListToken();
      if (lstMyTokens?.length > 0) {
        const lstMyToken = lstMyTokens;
        const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
        tokenFactoryStore.setRegisteredTokens(mergeLst);
      }

      const lstAllTokens = await tokenFactoryStore.getListAllTokens();
      tokenFactoryStore.setAllTokens(lstAllTokens);
    } catch (error) {
      console.log(error);
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
