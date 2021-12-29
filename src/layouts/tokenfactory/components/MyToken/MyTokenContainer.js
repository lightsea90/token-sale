/* eslint-disable jsx-a11y/alt-text */
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
  const { tokenStore } = tokenFactoryStore;
  const [rows, setRows] = useState([]);

  const handleResume = async (e) => {
    // console.log(e);
    history.push(`/token-factory/create-token?resume_token=${e.symbol}`);
  };

  const handleClaim = async (e) => {
    await tokenFactoryStore.claim(e);
  };
  useEffect(async () => {
    // eslint-disable-next-line no-debugger
    debugger;
    if (tokenStore.accountId) {
      await tokenFactoryStore.initContract();
      try {
        // const lst = await Promise.all([
        //   tokenFactoryStore.getListToken(),
        //   tokenFactoryStore.getListAllTokens(),
        // ]);

        // if (lst) {
        //   if (lst?.length > 0) {
        //     const lstMyToken = lst[0];
        //     const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
        //     tokenFactoryStore.setRegisteredTokens(mergeLst);
        //   }

        //   if (lst?.length > 1) tokenFactoryStore.setAllTokens(lst[1]);
        // }
        // const lstMyTokens = await tokenFactoryStore.getListToken();
        // if (lstMyTokens?.length > 0) {
        //   const lstMyToken = lstMyTokens;
        //   const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
        //   tokenFactoryStore.setRegisteredTokens(mergeLst);
        // }

        const lstAllTokens = await tokenFactoryStore.getListAllTokenContracts();
        const lstMyToken = lstAllTokens.filter((t) => t.creator === tokenStore.accountId);
        const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
        tokenFactoryStore.setRegisteredTokens(mergeLst);
        tokenFactoryStore.setAllTokens(lstAllTokens);
      } catch (error) {
        console.log(error);
      }
    }
  }, [tokenStore.accountId]);

  useEffect(() => {
    try {
      const data = tokenFactoryStore.registeredTokens.map((t) => ({
        ...t,
        ...{
          symbol: (
            <SuiBox>
              <img src={t.icon} style={{ verticalAlign: "middle" }} /> <span>{t.symbol}</span>
            </SuiBox>
          ),
          total_supply: humanize.numberFormat(t.total_supply / 10 ** t.decimals),
          allocated_num: humanize.numberFormat(t.allocated_num / 10 ** t.decimals),
          claimable_amount: humanize.numberFormat(t.claimable_amount / 10 ** t.decimals),
          claimed: humanize.numberFormat(t.claimed / 10 ** t.decimals),
          vesting_start_time: moment(t.vesting_start_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
          vesting_end_time: moment(t.vesting_end_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
          vesting_interval: Math.round(t.vesting_interval / (24 * 3600 * 10 ** 9)),
          action: (
            <SuiBox ml={-1.325}>
              {!t.allocation_initialized && (
                <SuiButton
                  variant="gradient"
                  color="warning"
                  onClick={() => handleResume(t)}
                  sx={{ marginRight: 1 }}
                >
                  <AutorenewOutlined sx={{ marginRight: 1 }} /> Resume
                </SuiButton>
              )}
              {t.allocation_initialized === 1 && t.claimable_amount !== "0" && (
                <SuiButton variant="gradient" color="primary" onClick={() => handleClaim(t)}>
                  <CheckCircleOutlined sx={{ marginRight: 1 }} /> Claim
                </SuiButton>
              )}
              {t.allocation_initialized === 1 && t.claimed === t.allocated_num && (
                <SuiButton disabled variant="gradient" color="success">
                  <CheckCircleOutlined sx={{ marginRight: 1 }} />
                </SuiButton>
              )}
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
  }, [tokenFactoryStore.registeredTokens]);

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
              { title: "Allocation", name: "allocated_num", align: "center" },
              { title: "Claimable", name: "claimable_amount", align: "center" },
              { title: "Claimed", name: "claimed", align: "center" },
              { title: "", name: "action", align: "right" },
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
