/* eslint-disable arrow-body-style */
// import { light } from "@mui/material/styles/createPalette";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
// import { useContext } from "react";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";
// import { useContext, useEffect } from "react";
// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  // const { tokenFactoryStore } = useContext(TokenFactoryContext);
  // const { tokenContract } = tokenStore;

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
