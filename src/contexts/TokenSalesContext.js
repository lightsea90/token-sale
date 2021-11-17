import React, { useState } from 'react'
import { createContext, useReducer, useEffect } from "react";
import getConfig from "../config";
import { connect, Contract, keyStores, WalletConnection, utils } from "near-api-js";
import { TokenStore } from '../stores/Token.store';

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