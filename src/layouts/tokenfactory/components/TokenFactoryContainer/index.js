/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
// import { light } from "@mui/material/styles/createPalette";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
// import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
// import { useContext } from "react";
import { LOCAL_STORAGE_CURRENT_TOKEN } from "layouts/tokenfactory/constants/TokenFactory";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";
// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);

  useEffect(async () => {
    await tokenFactoryStore.initContract();

    let token = localStorage.getItem(LOCAL_STORAGE_CURRENT_TOKEN);
    if (token) {
      token = JSON.parse(token);
      tokenFactoryStore.setToken(token);
      try {
        const tokenState = await tokenFactoryStore.getTokenState();
        if (tokenState) {
          tokenFactoryStore.saveTokenToLocalStorage(tokenState);
          const {
            ft_contract_deployed,
            deployer_contract_deployed,
            ft_issued,
            allocation_initialized,
          } = tokenState;

          if (ft_contract_deployed === 0) {
            await tokenFactoryStore.createContract();
          }
          if (deployer_contract_deployed === 0) {
            await tokenFactoryStore.createDeployerContract();
          }
          if (ft_issued === 0) {
            await tokenFactoryStore.issue();
          }
          if (allocation_initialized === 0) {
            await tokenFactoryStore.initTokenAllocation();
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <TokenFactoryStepper />
        </SuiBox>
        <SuiBox mb={3}>
          <CreateToken />
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};
export default observer(TokenFactoryContainer);
