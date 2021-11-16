import React, { useContext, useState } from 'react';
import { Container, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FormInput from "../../base/FormInput/FormInput";
import { TokenSalesContext } from '../../../contexts/TokenSalesContext';
import { TokenUtils } from '../../../helpers/TokenUtils';
import { observer } from 'mobx-react';

export const ActiveMode = {
    "DEPOSIT": "DEPOSIT",
    "WITHDRAW": "WITHDRAW",
    "REDEEM": "REDEEM"
}

let Home = (props) => {
    const { signOut } = props;
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
        redeem
    } = tokenStore;
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [activeMode, setActiveMode] = useState(ActiveMode.WITHDRAW);
    const [loading, setLoading] = useState(false);

    const submitDeposit = (value) => {

    };
    const submitWithdraw = (value) => {
    };
    const submitRedeem = (value) => {
    };

    const handleSubmitClick = (value) => {
        switch (activeMode) {
            case ActiveMode.DEPOSIT:
                submitDeposit(deposit);
                break;
            case ActiveMode.WITHDRAW:
                submitWithdraw(withdraw);
                break;
            case ActiveMode.REDEEM:
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
            <Button
                variant="contained"
                onClick={() => { signOut(); }}
                color="error"
                sx={{ position: 'right' }}
            >
                Sign out
            </Button>
            <Container fixed>
                <Typography variant="h3">
                    Welcome to TokenHub {tokenState?.walletConnection?.getAccountId()}!
                </Typography>

                <FormInput
                    helperText="Please enter your deposit"
                    label="Deposite"
                    defaultValue={nearUtils.format.formatNearAmount(userContract?.deposit || 0)}
                    disabled={userContract?.is_redeemed || tokenContract?.tokenPeriod != "FINISHED"}
                    onTextChange={(e) => {
                        setDeposit(e.target.value);
                    }}
                    onButtonClick={() => {
                        setActiveMode(ActiveMode.DEPOSIT);
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />

                <FormInput
                    helperText="Please enter your withdraw"
                    label="Withdraw"
                    disabled={userContract?.is_redeemed || tokenContract?.tokenPeriod != "FINISHED"}
                    onTextChange={(e) => {
                        setWithdraw(e.target.value);
                    }}
                    onButtonClick={() => {
                        setActiveMode(ActiveMode.WITHDRAW);
                        setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                />

                <FormInput
                    helperText="Please enter your redeem"
                    label="Redeem"
                    defaultValue={handleRedeemValue()}
                    disabled={userContract?.is_redeemed || tokenContract?.tokenPeriod != "FINISHED"}
                    onTextChange={(e) => {
                        setRedeem(e.target.value);
                    }}
                    onButtonClick={() => {
                        setActiveMode(ActiveMode.REDEEM);
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