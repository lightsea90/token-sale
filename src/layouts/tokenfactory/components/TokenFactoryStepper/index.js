/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { Card, Grid } from "@mui/material";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
import { useContext } from "react";
import CustomizedSteppers from "./CustomizedSteppers";

const TokenFactoryStepper = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        <Card>
          <CustomizedSteppers
            steps={tokenFactoryStore.steps}
            activeStep={tokenFactoryStore.activeStep}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
export default observer(TokenFactoryStepper);
