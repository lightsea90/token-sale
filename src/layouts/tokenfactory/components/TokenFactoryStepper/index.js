/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { Card, Grid } from "@mui/material";
import CustomizedSteppers from "components/App/CustomizedSteppers";
import { observer } from "mobx-react";

const TokenFactoryStepper = (props) => {
  const { steps } = props;

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        <Card>
          <CustomizedSteppers steps={steps} />
        </Card>
      </Grid>
    </Grid>
  );
};
export default observer(TokenFactoryStepper);
