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
  const { tokenStore } = tokenFactoryStore;
  const [rows, setRows] = useState([]);
  useEffect(async () => {
    // eslint-disable-next-line no-debugger
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

  useEffect(() => {
    if (tokenFactoryStore.registeredTokens) {
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
                    count={tokenFactoryStore.analysisData?.numberCreators || 0}
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
                    count={tokenFactoryStore.analysisData?.totals || 0}
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
