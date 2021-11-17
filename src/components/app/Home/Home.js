import React, { useContext, useState } from 'react';
import { Container, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FormInput from "../../base/FormInput/FormInput";
import { TokenSalesContext } from '../../../contexts/TokenSalesContext';
import { TokenUtils } from '../../../helpers/TokenUtils';
import { observer } from 'mobx-react';

let Home = (props) => {
    const {
        tokenStore
    } = useContext(TokenSalesContext);
    let {
        userContract,
        nearUtils,
        tokenContract,
        tokenState,
        logout,
        period,
        loading
    } = tokenStore;
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleSubmitClick = async () => {
        loading = true;
        switch (period) {
            case "ON_SALE":
                await tokenStore.submitDeposit();
                break;
            case "ON_GRACE":
                await tokenStore.submitWithdraw();
                break;
            case "FINISHED":
                await tokenStore.submitRedeem();
                break;
        }
        loading = false;
        setOpenConfirmDialog(false);
    }

    const handleRedeemValue = () => {
        if (userContract?.total_allocated_tokens) {
            return TokenUtils.formatTokenAmountToHumanReadable(userContract.total_allocated_tokens, tokenContract.tokenInfo.decimals);
        }
        return 0;
    }

    const onCloseClick = () => {
        setOpenConfirmDialog(false);
    }

    return (
        <>
            <Container fixed>
                <Typography variant="h5">
                    Welcome to TokenHub {tokenState?.walletConnection?.getAccountId()}!
                    <Button
                        variant="contained"
                        onClick={() => { logout(); }}
                        color="error"
                        sx={{ position: 'right' }}

                    >
                        Sign out
                    </Button>
                </Typography>
                <FormInput
                    helperText="Please enter your deposit"
                    label={`Deposit : ${nearUtils.format.formatNearAmount(userContract?.deposit || 0)}`}
                    disabled={tokenStore.period !== "ON_SALE"}
                    buttonDisable={tokenStore.deposit === 0}
                    onTextChange={(e) => {
                        tokenStore.deposit = e.target.value;
                    }}
                    onButtonClick={() => {
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />

                <FormInput
                    helperText="Please enter your withdraw"
                    label="Withdraw"
                    disabled={tokenStore.period !== "ON_GRACE"}
                    buttonDisable={tokenStore.withdraw === 0}
                    onTextChange={(e) => {
                        tokenStore.withdraw = e.target.value;
                    }}
                    onButtonClick={() => {
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />

                <FormInput
                    helperText="Please enter your redeem"
                    label="Redeem"
                    defaultValue={handleRedeemValue()}
                    buttonDisable={tokenStore.redeem === 0}
                    disabled={userContract?.is_redeemed == 0 || tokenStore.period !== "FINISHED"}
                    onTextChange={(e) => {
                        tokenStore.redeem = e.target.value;
                    }}
                    onButtonClick={() => {
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />
            </Container>
            <Dialog
                open={openConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmation!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseClick}>Close</Button>
                    <LoadingButton
                        onClick={handleSubmitClick}
                        endIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="end"
                        variant="contained"
                    />
                </DialogActions>
            </Dialog>
        </>
    )
}
Home = observer(Home);
export default Home;