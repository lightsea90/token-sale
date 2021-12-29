/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
// import { light } from "@mui/material/styles/createPalette";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
// import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
import { useContext, useEffect, useReducer } from "react";
// import { useContext } from "react";
// import { LOCAL_STORAGE_CURRENT_TOKEN } from "layouts/tokenfactory/constants/TokenFactory";
import SuiAlert from "components/SuiAlert";
import { Grid } from "@mui/material";
import moment from "moment";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";
// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const { tokenStore } = tokenFactoryStore;

  const [alert, setAlert] = useReducer((state, newState) => ({ ...state, ...newState }), {
    open: false,
    message: "",
    color: "error",
  });

  const getTokenTransactionStatus = async () => {
    const searchs = window.location.search.split("&");
    const transactionHash = searchs.find((s) => s.includes("transactionHashes")).split("=");
    const txHash = transactionHash[transactionHash.length - 1];
    const status = await tokenFactoryStore.getTransactionStatus(txHash);

    return status;
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

  useEffect(async () => {
    // eslint-disable-next-line no-debugger
    debugger;
    if (tokenFactoryStore.contract) {
      // eslint-disable-next-line no-debugger
      // debugger;
      // let token = localStorage.getItem(LOCAL_STORAGE_CURRENT_TOKEN);
      let token;
      if (window.location.search && window.location.search.includes("transactionHashes")) {
        const result = await getTokenTransactionStatus();
        if (result.status?.SuccessValue != null) {
          const action = result.transaction?.actions[0]?.FunctionCall;
          if (action.method_name === "register" && action.args) {
            token = JSON.parse(Buffer.from(action.args, "base64").toString("utf-8"));
            token = {
              ...token,
              ...{
                tokenName: token.token_name,
                symbol: token.symbol,
                initialSupply: token.total_supply / 10 ** token.decimal,
                decimal: token.decimals,
                initialRelease: (token.initial_release / token.total_supply) * 100,
                treasury: (token.treasury_allocation / token.total_supply) * 100,
                vestingStartTime: token.vesting_start_time / 10 ** 6,
                vestingEndTime: token.vesting_end_time / 10 ** 6,
                vestingInterval: token.vesting_interval / (24 * 3600 * 10 ** 9),
                vestingDuration: Math.round(
                  (moment(token.vesting_end_time / 10 ** 6) -
                    moment(token.vesting_start_time / 10 ** 6)) /
                    (10 ** 3 * 24 * 3600)
                ),
              },
            };
            tokenFactoryStore.setToken(token);
          }
        }
      }
      if (window.location.search && window.location.search.includes("resume_token")) {
        const searchs = window.location.search.split("&");
        const resumeToken = searchs.find((s) => s.includes("resume_token")).split("=");
        const tokenSymbol = resumeToken[resumeToken.length - 1];
        token = tokenFactoryStore.registeredTokens.find((rt) => rt.symbol === tokenSymbol);
        tokenFactoryStore.setToken(token);
      }

      if (token) {
        try {
          const tokenState = await tokenFactoryStore.getTokenState();
          if (tokenState) {
            tokenFactoryStore.appendRegisteredToken({ ...tokenState, ...token });
            const {
              ft_contract_deployed,
              deployer_contract_deployed,
              ft_issued,
              allocation_initialized,
            } = tokenState;

            if (ft_contract_deployed === 0) {
              setAlert({
                open: true,
                message: "Creating contract ...",
                color: "primary",
              });
              await tokenFactoryStore.createContract();
            }
            if (deployer_contract_deployed === 0) {
              setAlert({
                open: true,
                message: "Creating deployer contract ...",
                color: "primary",
              });
              await tokenFactoryStore.createDeployerContract();
            }
            if (ft_issued === 0) {
              setAlert({
                open: true,
                message: "Issuing ...",
                color: "primary",
              });
              await tokenFactoryStore.issue();
            }
            if (allocation_initialized === 0) {
              setAlert({
                open: true,
                message: "Initiating token allocation ...",
                color: "primary",
              });
              const res = await tokenFactoryStore.initTokenAllocation();
              if (res) {
                setAlert({
                  open: true,
                  message: "Create Token Success",
                  color: "success",
                });
              }
            }
          }
        } catch (error) {
          if (error?.type !== "NotEnoughAllowance")
            setAlert({
              open: true,
              message: error.message,
              color: "error",
            });
          console.log(error);
          console.log(error.type);
        }
      }
    }
  }, [tokenFactoryStore.contract]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <TokenFactoryStepper />
        </SuiBox>
        <SuiBox mb={3}>
          <CreateToken setAlert={setAlert} />
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
export default observer(TokenFactoryContainer);
