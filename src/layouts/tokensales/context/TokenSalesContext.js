/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import React, { createContext } from "react";
import { TokenSalesStore } from "../stores/TokenSales.store";

const TokenSalesContext = createContext();
const tokenSalesStore = new TokenSalesStore();
const TokenSalesProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;
  tokenSalesStore.setTokenStore(tokenStore);
  return (
    <TokenSalesContext.Provider
      value={{
        tokenSalesStore,
      }}
    >
      {children}
    </TokenSalesContext.Provider>
  );
};

export { TokenSalesContext, TokenSalesProvider };
