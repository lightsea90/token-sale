// Soft UI Dashboard React examples
import Table from "examples/Tables/Table";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard PRO React components
import { observer } from "mobx-react";
import { useContext, useEffect, useReducer, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TokenNavbar from "components/App/TokenNavbar";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import SuiButton from "components/SuiButton";
import { AutorenewOutlined, CheckCircleOutlined } from "@mui/icons-material";
import moment from "moment";
import humanize from "humanize";
import { Grid } from "@mui/material";
import SuiAlert from "components/SuiAlert";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useHistory } from "react-router";

const MyTokenContainer = () => {
  const [alert, setAlert] = useReducer((state, newState) => ({ ...state, ...newState }), {
    open: false,
    message: "",
    color: "error",
  });
  const history = useHistory();
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  // const { tokenStore } = tokenFactoryStore;
  const [rows, setRows] = useState([]);

  const handleResume = async (e) => {
    // console.log(e);
    history.push(`/token-factory/create-token?resume_token=${e.symbol}`);
  };

  const handleClaim = async (e) => {
    await tokenFactoryStore.claim(e);
  };

  // const handleClaimTransaction = async () => {
  //   if (window.location.search && window.location.search.includes("transactionHashes")) {
  //     const search = window.location.search.split("&");
  //     const transaction = search.find((s) => s.includes("transactionHashes")).split("=");
  //     const txHash = transaction[transaction.length - 1];
  //     try {
  //       const res = await tokenFactoryStore.getTransactionStatus(txHash);
  //       console.log(res);
  //       if (res?.status?.SuccessValue) {
  //         const claimActions = res.transaction.actions.find(
  //           (i) => i.FunctionCall.method_name === "claim"
  //         );
  //         const receiverId = res.transaction.receiver_id;
  //         if (claimActions && receiverId) {
  //           const reciever = rows.find((r) => r.ft_deployer === receiverId);
  //           if (reciever) {
  //             reciever.claimed = 1;
  //             setRows([...rows, ...[reciever]]);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setAlert({
  //         open: true,
  //         message: error.message,
  //         color: "error",
  //       });
  //     }
  //   }
  // };

  useEffect(() => {
    try {
      const data = tokenFactoryStore.registeredTokens.map((t) => ({
        ...t,
        ...{
          total_supply: humanize.numberFormat(t.total_supply / 10 ** t.decimals),
          vesting_start_time: moment(t.vesting_start_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
          vesting_end_time: moment(t.vesting_end_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
          vesting_interval: t.vesting_interval / (24 * 3600 * 10 ** 9),
          action: (
            <SuiBox ml={-1.325}>
              {!t.init_token_allocation ? (
                <SuiButton
                  variant="gradient"
                  color="warning"
                  onClick={() => handleResume(t)}
                  sx={{ marginRight: 1 }}
                >
                  <AutorenewOutlined sx={{ marginRight: 1 }} /> Resume
                </SuiButton>
              ) : (
                <SuiButton variant="gradient" color="primary" onClick={() => handleClaim(t)}>
                  <CheckCircleOutlined sx={{ marginRight: 1 }} /> Claim
                </SuiButton>
              )}
              {t.claimed && <CheckCircleOutlined />}
            </SuiBox>
          ),
        },
      }));
      setRows(data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        color: "error",
      });
      console.log(error);
    }
  }, []);

  // useEffect(async () => {
  //   if (tokenStore.accountId) {
  //     await handleClaimTransaction();
  //   }
  // }, [tokenStore.accountId]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Table
            columns={[
              { title: "Token Name", name: "token_name", align: "left" },
              { title: "Symbol", name: "symbol", align: "left" },
              { title: "Total Supply", name: "total_supply", align: "left" },
              { title: "Vesting Start Time", name: "vesting_start_time", align: "center" },
              { title: "Vesting End Time", name: "vesting_end_time", align: "center" },
              { title: "Vesting Interval (days)", name: "vesting_interval", align: "center" },
              { title: "", name: "action", align: "center" },
            ]}
            rows={rows}
          />
          {alert.open && (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={8}>
                <SuiBox mt={4} mb={1}>
                  <SuiAlert color={alert.color} dismissible>
                    {alert.message}
                  </SuiAlert>
                </SuiBox>
              </Grid>
            </Grid>
          )}
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};

export default observer(MyTokenContainer);
