import { Grid } from "@mui/material";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import moment from "moment";
import { useContext, useEffect } from "react";
import PeriodCard from "../PeriodCard/PeriodCard";
import TokenInfo from "../TokenInfo";
import TokenSalesForm from "../TokenSalesForm";

const TokenSalesContainer = () => {
  const { tokenStore } = useContext(TokenSalesContext);
  const { tokenContract } = tokenStore;

  useEffect(async () => {
    await tokenStore.initContract();
  }, []);
  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "start time" }}
                period={
                  new Date(tokenContract?.saleInfo?.start_time / 1000000).toLocaleDateString() || ""
                }
                icon={{ color: "warning", component: "access_time" }}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "sales period" }}
                period={
                  moment.duration(tokenContract?.saleInfo?.sale_duration / 1000000).humanize() || ""
                }
                icon={{ color: "info", component: "access_time" }}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "grace period" }}
                period={
                  moment.duration(tokenContract?.saleInfo?.grace_duration / 1000000).humanize() ||
                  ""
                }
                icon={{ color: "primary", component: "access_time" }}
              />
            </Grid>
          </Grid>
        </SuiBox>
        <SuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TokenSalesForm />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TokenInfo />
            </Grid>
          </Grid>
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};

export default observer(TokenSalesContainer);
