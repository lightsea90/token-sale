import { Alert, Container, Grid, LinearProgress, Snackbar } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useContext, useEffect } from "react";
import Home from "./components/app/Home/Home";
import Login from "./components/app/Login/Login";
import Notification from './components/app/Notification/Notification';
import TokenInformation from './components/app/TokenInformation/TokenInformation';
import { TokenSalesContext } from "./contexts/TokenSalesContext";

let App = () => {
    const { tokenStore } = useContext(TokenSalesContext);

    const {
        tokenState,
        initContract,
        isSignedIn,
        notification
    } = tokenStore;


    //after submitting the from, we want to show notification

    // The useEffect hook can be used to fire side-effects during render
    useEffect(async () => {
        await initContract();
    }, []);

    return (
        <Container>
            {
                tokenState ? <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {!isSignedIn ? <Login /> : <Home />}
                    </Grid>
                    <Grid item xs={6}>
                        <TokenInformation />
                    </Grid>
                    <Snackbar open={notification.show} onClose={notification.handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Alert severity={notification.type} sx={{ width: '100%' }}>
                            {notification.message}
                        </Alert>
                    </Snackbar>
                </Grid> : <LinearProgress />
            }
        </Container>
    )
}
App = observer(App);
export default App;