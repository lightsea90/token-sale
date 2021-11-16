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
    const {
        userContract,
        nearUtils,
        tokenContract,
        tokenState,
        deposit,
        withdraw,
        redeem,
        logout,
        period
    } = tokenStore;
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmitClick = (value) => {
        switch (period) {
            case "ON_SALE":
                submitDeposit(deposit);
                break;
            case "ON_GRACE":
                submitWithdraw(withdraw);
                break;
            case "FINISHED":
                submitRedeem(redeem);
                break;
        }
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
                    label="Deposit"
                    defaultValue={nearUtils.format.formatNearAmount(userContract?.deposit || 0)}
                    disabled={period !== "ON_SALE"}
                    onTextChange={(e) => {
                        deposit = e.target.value;
                    }}
                    onButtonClick={() => {
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />

                <FormInput
                    helperText="Please enter your withdraw"
                    label="Withdraw"
                    disabled={period !== "ON_GRACE"}
                    onTextChange={(e) => {
                        withdraw = e.target.value;
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
                    disabled={userContract?.is_redeemed == 0 || period !== "FINISHED"}
                    onTextChange={(e) => {
                        redeem = e.target.value;
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
                    <Button onClick={onCloseClick}>Disagree</Button>
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