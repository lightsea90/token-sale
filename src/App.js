import { Container } from '@mui/material';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { useContext, useEffect, useState } from "react";
import Home from "./components/app/Home/Home";
import Login from "./components/app/Login/Login";
import TokenInforamation from "./components/app/TokenInformation/TokenInforamation";
import { TokenSalesContext } from "./contexts/TokenSalesContext";
import { useTokenStore } from './stores/Token.store';

let App = () => {
    const { tokenStore } = useContext(TokenSalesContext);

    const {
        tokenState,
        tokenContract,
        initContract,
    } = tokenStore;


    //after submitting the from, we want to show notification

    // The useEffect hook can be used to fire side-effects during render
    useEffect(async () => {
        await initContract();
    }, []);

    return (
        <>
            {
                tokenState ?? <Container>
                    {!tokenState?.walletConnection.isSignedIn() ?? <Login />}
                    {tokenState?.walletConnection.isSignedIn() ?? <Home />}
                    {tokenContract != null && <TokenInforamation />}
                    {/* {showNotification && <Notification />} */}
                </Container>
            }
        </>
    )
}
App = observer(App);
export default App;