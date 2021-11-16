import React, { useContext } from 'react'
import { Button, CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import { observer } from 'mobx-react';
import { TokenSalesContext } from '../../../contexts/TokenSalesContext';
import { green } from '@mui/material/colors';

let Login = (props) => {
    const { tokenStore } = useContext(TokenSalesContext);
    const [loading, setLoading] = useState(false);
    const handleLoginClick = async () => {
        setLoading(true);
        await tokenStore.login();
        setLoading(false);
    }
    return (
        <>
            <Typography variant="h2" textAlign="center">Welcome to TokenHub!</Typography>
            <Typography variant="h5" textAlign="center">
                We based on NEAR Protocol. Please sign in by your Near wallet if you want to join us.
            </Typography>
            <Typography variant="h5" textAlign="center" marginTop="2">
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleLoginClick}
                    >
                        Sign in
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </Typography>
        </>
    )
}
Login = observer(Login);
export default Login;