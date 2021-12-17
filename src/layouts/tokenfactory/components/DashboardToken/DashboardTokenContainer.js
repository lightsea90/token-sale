/* eslint-disable jsx-a11y/alt-text */
// Soft UI Dashboard React examples
import Table from "examples/Tables/Table";

// Soft UI Dashboard React components
import SuiBox from "components/SuiBox";

// Soft UI Dashboard PRO React components
import { observer } from "mobx-react";
import { useContext, useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TokenNavbar from "components/App/TokenNavbar";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import humanize from "humanize";
import { Grid } from "@mui/material";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
// eslint-disable-next-line import/no-extraneous-dependencies

const DashboardTokenContainer = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  // const { tokenStore } = tokenFactoryStore;
  const [rows, setRows] = useState([]);

  useEffect(() => {
    try {
      const data = tokenFactoryStore.allTokens.map((t) => ({
        ...t,
        ...{
          symbol: (
            <a
              href={`https://explorer.testnet.near.org/accounts/${t.ft_contract}`}
              target="_blank"
              rel="noreferrer"
            >
              <SuiBox>
                <img src={t.icon} style={{ verticalAlign: "middle" }} /> <span>{t.symbol}</span>
              </SuiBox>
            </a>
          ),
          creator: (
            <a
              href={`https://explorer.testnet.near.org/accounts/${t.creator}`}
              target="_blank"
              rel="noreferrer"
            >
              {t.creator}
            </a>
          ),
          total_supply: humanize.numberFormat(t.total_supply / 10 ** t.decimals),
        },
      }));
      setRows(data);
    } catch (error) {
      console.log(error);
    }
  }, [tokenFactoryStore.registeredTokens]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} xl={6}>
                  <MiniStatisticsCard
                    title={{ text: "Total creators" }}
                    count={tokenFactoryStore.analysisData?.numberCreators}
                    icon={{ color: "primary", component: "people" }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={4} xl={4}>
                  <MiniStatisticsCard
                    title={{ text: "Total symbols" }}
                    count={tokenFactoryStore.analysisData?.numberSymbols}
                    icon={{ color: "success", component: "currency_bitcoin" }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6} xl={6}>
                  <MiniStatisticsCard
                    title={{ text: "Total tokens" }}
                    count={tokenFactoryStore.analysisData?.totals}
                    icon={{ color: "success", component: "currency_bitcoin" }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SuiBox>
        <SuiBox mb={3}>
          <Table
            columns={[
              { title: "Token Name", name: "token_name", align: "left" },
              { title: "Symbol", name: "symbol", align: "left" },
              { title: "Creator", name: "creator", align: "left" },
              { title: "Total Supply", name: "total_supply", align: "left" },
            ]}
            rows={rows}
          />
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};

export default observer(DashboardTokenContainer);
