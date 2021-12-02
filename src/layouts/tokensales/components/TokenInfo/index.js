/* eslint-disable import/named */
import { Card, Grid, Skeleton } from "@mui/material";
import SuiBox from "components/SuiBox";
import { formatTokenAmountToHumanReadable } from "helpers/TokenUltis";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import wavesWhite from "assets/images/shapes/waves-white.svg";
import SuiTypography from "components/SuiTypography";

const TokenInfo = () => {
  const { tokenSalesStore } = useContext(TokenSalesContext);
  const { tokenContract } = tokenSalesStore;

  useEffect(() => {
    console.log(tokenContract);
  }, []);

  return (
    <>
      {tokenContract?.tokenInfo ? (
        <Card>
          <SuiBox p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <SuiBox display="flex" flexDirection="column" height="100%">
                  <SuiTypography variant="h6" component="div">
                    Number of tokens for sale:{" "}
                    {formatTokenAmountToHumanReadable(
                      tokenContract.saleInfo.num_of_tokens.toString(),
                      tokenContract.tokenInfo.decimals
                    )}
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    Current period: {tokenContract.tokenPeriod}
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    Total deposit: {tokenContract.totalDeposit.formatted_amount}
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    Price:{" "}
                    {tokenContract.totalDeposit.formatted_amount /
                      formatTokenAmountToHumanReadable(
                        tokenContract.saleInfo.num_of_tokens.toString(),
                        tokenContract.tokenInfo.decimals
                      )}
                  </SuiTypography>
                </SuiBox>
              </Grid>
              <Grid item xs={12} lg={5} sx={{ position: "relative", ml: "auto" }}>
                <SuiBox
                  height="100%"
                  display="grid"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="info"
                  borderRadius="lg"
                  variant="gradient"
                >
                  <SuiBox
                    component="img"
                    src={wavesWhite}
                    alt="waves"
                    display="block"
                    position="absolute"
                    left={0}
                    width="100%"
                    height="100%"
                  />
                  {/* <SuiBox component="img" src={rocketWhite} alt="rocket" width="100%" pt={3} /> */}
                  <SuiTypography variant="h1" fontWeight="bold" color="white">
                    {tokenContract.tokenInfo.symbol}
                  </SuiTypography>
                </SuiBox>
              </Grid>
            </Grid>
          </SuiBox>
        </Card>
      ) : (
        <SuiBox>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </SuiBox>
      )}
    </>
  );
};

export default observer(TokenInfo);
