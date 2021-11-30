/* eslint-disable default-case */
/* eslint-disable no-console */
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import SuiBox from "components/SuiBox";
import { formatTokenAmountToHumanReadable } from "helpers/TokenUltis";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import { useContext, useState } from "react";
import SalesForm from "../SalesForm";

export const ACTION = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  REDEEM: "REDEEM",
};
const TokenSalesForm = () => {
  const { tokenStore } = useContext(TokenSalesContext);
  const { userContract, nearUtils, tokenContract } = tokenStore;
  let { loading } = tokenStore;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [action, setAction] = useState();

  const handleSubmitClick = async () => {
    loading = true;
    try {
      switch (action) {
        case ACTION.DEPOSIT:
          await tokenStore.submitDeposit();
          break;
        case ACTION.WITHDRAWAL:
          await tokenStore.submitWithdraw();
          break;
        case ACTION.REDEEM:
          await tokenStore.submitRedeem();
          break;
      }
    } catch (error) {
      console.log(error);
    }
    loading = false;
    // setOpenConfirmDialog(false);
  };
  const onCloseClick = () => {
    setOpenConfirmDialog(false);
  };

  const handleRedeemValue = () => {
    if (userContract?.total_allocated_tokens) {
      return formatTokenAmountToHumanReadable(
        userContract.total_allocated_tokens,
        tokenContract.tokenInfo.decimals
      );
    }
    return 0;
  };
  return (
    <>
      <Card>
        <SuiBox p={2}>
          {userContract ? (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <SuiBox display="flex" flexDirection="column" height="100%">
                  <SalesForm
                    helperText="Please enter your deposit"
                    label={`Deposit : ${nearUtils.format.formatNearAmount(
                      userContract?.deposit || 0
                    )}`}
                    disabled={!(tokenStore.period === "ON_SALE")}
                    buttonDisable={tokenStore.deposit === 0}
                    onTextChange={(e) => {
                      tokenStore.deposit = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.DEPOSIT);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                  />

                  <SalesForm
                    helperText="Please enter your withdraw"
                    label="Withdraw"
                    disabled={
                      !(tokenStore.period === "ON_SALE" || tokenStore.period === "ON_GRACE")
                    }
                    buttonDisable={tokenStore.withdraw === 0}
                    onTextChange={(e) => {
                      tokenStore.withdraw = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.WITHDRAWAL);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                  />

                  <SalesForm
                    helperText="Please enter your redeem"
                    label="Redeem"
                    defaultValue={handleRedeemValue()}
                    buttonDisable={
                      userContract?.is_redeemed === 1 || tokenStore.period !== "FINISHED"
                    }
                    disabled={userContract?.is_redeemed === 1 || tokenStore.period !== "FINISHED"}
                    onTextChange={(e) => {
                      tokenStore.redeem = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.REDEEM);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                  />
                </SuiBox>
              </Grid>
            </Grid>
          ) : (
            <>
              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h2" component="div" sx={{ width: "100%" }}>
                  <Skeleton />
                </Typography>
              </Paper>
              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h2" component="div" sx={{ width: "100%" }}>
                  <Skeleton />
                </Typography>
              </Paper>
              <Paper
                component="div"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Typography variant="h2" component="div" sx={{ width: "100%" }}>
                  <Skeleton />
                </Typography>
              </Paper>
            </>
          )}
        </SuiBox>
      </Card>
      <Dialog
        open={openConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure ?</DialogContentText>
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
  );
};
export default observer(TokenSalesForm);
