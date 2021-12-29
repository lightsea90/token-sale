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

export const TokenSalesFormSkeleton = () => (
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
);

const TokenSalesForm = () => {
  const { tokenSalesStore } = useContext(TokenSalesContext);
  const { userContract, tokenContract, tokenStore } = tokenSalesStore;
  const { nearUtils } = tokenStore;
  let { loading } = tokenSalesStore;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [action, setAction] = useState();

  const handleSubmitClick = async () => {
    loading = true;
    try {
      switch (action) {
        case ACTION.DEPOSIT:
          await tokenSalesStore.submitDeposit();
          break;
        case ACTION.WITHDRAWAL:
          await tokenSalesStore.submitWithdraw();
          break;
        case ACTION.REDEEM:
          await tokenSalesStore.submitRedeem();
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
                    disabled={!(tokenContract?.tokenPeriod === "ON_SALE")}
                    buttonDisable={tokenSalesStore.deposit === 0}
                    onTextChange={(e) => {
                      tokenSalesStore.deposit = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.DEPOSIT);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                    adornment="NEAR"
                    buttonText="Deposit"
                  />

                  <SalesForm
                    helperText="Please enter your withdraw"
                    label="Withdraw"
                    disabled={
                      !(
                        tokenContract?.tokenPeriod === "ON_SALE" ||
                        tokenContract?.tokenPeriod === "ON_GRACE"
                      )
                    }
                    buttonDisable={tokenSalesStore.withdraw === 0}
                    onTextChange={(e) => {
                      tokenSalesStore.withdraw = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.WITHDRAWAL);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                    adornment="NEAR"
                    buttonText="Withdrawal"
                  />

                  <SalesForm
                    helperText="Please enter your redeem"
                    label="Redeem"
                    defaultValue={handleRedeemValue()}
                    buttonDisable={
                      userContract?.is_redeemed === 1 || tokenContract.tokenPeriod !== "FINISHED"
                    }
                    disabled={
                      userContract?.is_redeemed === 1 || tokenContract.tokenPeriod !== "FINISHED"
                    }
                    onTextChange={(e) => {
                      tokenSalesStore.redeem = e.target.value;
                    }}
                    onButtonClick={() => {
                      setAction(ACTION.REDEEM);
                      setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                    adornment={tokenContract.tokenInfo.symbol || ""}
                    buttonText="Redeem"
                  />
                </SuiBox>
              </Grid>
            </Grid>
          ) : (
            <TokenSalesFormSkeleton />
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
