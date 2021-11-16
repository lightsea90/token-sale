import React, { useState } from 'react'
import { createContext, useReducer, useEffect } from "react";
import getConfig from "../config";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import { TokenStore } from '../stores/Token.store';

// const initTokenState = {
//     walletConnection: null,
//     accountId: null,
//     contract: null
// };

// const initUserContract = {
//     userSale: null,
//     userPeriod: null
// };

// const initTokenContract = {
//     totalDeposit: 0,
//     tokenPeriod: null
// };

// const initTokenInfo = {
//     symbol: null,
//     decimals: 0
// };

const TokenSalesContext = createContext();
const tokenStore = new TokenStore();
const TokenSalesProvider = (props) => {
    const { children } = props;
    return (
        <TokenSalesContext.Provider
            value={{
                tokenStore
            }}
        >
            {children}
        </TokenSalesContext.Provider>
    )
};

export { TokenSalesContext, TokenSalesProvider };