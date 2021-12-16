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
