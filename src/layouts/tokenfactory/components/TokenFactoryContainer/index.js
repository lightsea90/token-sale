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
import { LOCAL_STORAGE_CURRENT_TOKEN } from "layouts/tokenfactory/constants/TokenFactory";
import SuiAlert from "components/SuiAlert";
import { Grid } from "@mui/material";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";
// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);

  const [alert, setAlert] = useReducer((state, newState) => ({ ...state, ...newState }), {
    open: false,
    message: "",
    color: "error",
  });

  useEffect(async () => {
    if (tokenFactoryStore.contract) {
      let token = localStorage.getItem(LOCAL_STORAGE_CURRENT_TOKEN);
      if (window.location.search && window.location.search.includes("resume_token")) {
        const searchs = window.location.search.split("&");
        const resumeToken = searchs.find((s) => s.includes("resume_token")).split("=");
        const tokenSymbol = resumeToken[resumeToken.length - 1];
        token = tokenFactoryStore.registeredTokens.find((rt) => rt.symbol === tokenSymbol);
        tokenFactoryStore.setToken(token);
      } else if (token) {
        token = JSON.parse(token);
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
          setAlert({
            open: true,
            message: error.message,
            color: "error",
          });
          console.log(error);
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
