/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import React, { createContext } from "react";
import { TokenSalesStore } from "../stores/TokenSales.store";

const TokenSalesContext = createContext();
const tokenStore = new TokenSalesStore();
const TokenSalesProvider = (props) => {
  const { children } = props;
  return (
    <TokenSalesContext.Provider
      value={{
        tokenStore,
      }}
    >
      {children}
    </TokenSalesContext.Provider>
  );
};

export { TokenSalesContext, TokenSalesProvider };
