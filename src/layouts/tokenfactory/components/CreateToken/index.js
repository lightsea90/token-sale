/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Grid } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";

const CreateToken = (props) => {
  const { data } = props;

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        <Card sx={{ p: 3, margin: "auto", flexGrow: 10 }}>
          <SuiBox component="form" role="form">
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Token Name
                </SuiTypography>
              </SuiBox>
              <SuiInput required type="text" placeholder="Token Name" />
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Symbol
                </SuiTypography>
              </SuiBox>
              <SuiInput required type="text" placeholder="Symbol" />
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Initial Supply
                </SuiTypography>
              </SuiBox>
              <SuiInput required type="number" placeholder="Initial Supply" value={21000000} />
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                ~21M
              </SuiTypography>
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Decimals (1-18)
                </SuiTypography>
              </SuiBox>
              <SuiInput required type="number" value={8} />
            </SuiBox>
            <SuiBox mt={4} mb={1}>
              <SuiButton variant="gradient" color="info">
                Create Token
              </SuiButton>
            </SuiBox>
          </SuiBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CreateToken;
