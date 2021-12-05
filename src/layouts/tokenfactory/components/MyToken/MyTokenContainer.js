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
import { LOCAL_STORAGE_REGISTERED_TOKEN } from "layouts/tokenfactory/constants/TokenFactory";
import SuiButton from "components/SuiButton";
import { AutorenewOutlined, CheckCircleOutlined } from "@mui/icons-material";
import moment from "moment";
import humanize from "humanize";

const MyTokenContainer = () => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleResume = async () => {
    // console.log(e);
    await tokenFactoryStore.getTransactionStatus("DesMBUXrRarh1niQ9GEN4gGvDE6nGzM516ygBBJx6Amq");
  };

  const handleClaim = async (e) => {
    setLoading(true);
    const res = await tokenFactoryStore.claim(e);
    console.log(res);
    setRows([...rows, ...[e]]);
    setLoading(false);
  };

  useEffect(() => {
    console.log(rows);
    let registeredTokens = localStorage.getItem(LOCAL_STORAGE_REGISTERED_TOKEN);
    try {
      if (registeredTokens) {
        registeredTokens = JSON.parse(registeredTokens);
        const data = registeredTokens.map((t) => ({
          ...t,
          ...{
            total_supply: humanize.numberFormat(t.total_supply / 10 ** t.decimals),
            vesting_start_time: moment(t.vesting_start_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
            vesting_end_time: moment(t.vesting_end_time / 10 ** 6).format("DD/MM/YY hh:mm a"),
            vesting_interval: t.vesting_interval / (24 * 3600 * 10 ** 9),
            action: (
              <SuiBox ml={-1.325}>
                {!t.init_token_allocation ? (
                  <SuiButton
                    disabled={loading}
                    variant="gradient"
                    color="warning"
                    onClick={() => handleResume(t)}
                    sx={{ marginRight: 1 }}
                  >
                    <AutorenewOutlined sx={{ marginRight: 1 }} /> Resume
                  </SuiButton>
                ) : (
                  <SuiButton
                    variant="gradient"
                    color="primary"
                    onClick={() => handleClaim(t)}
                    disabled={loading}
                  >
                    <CheckCircleOutlined sx={{ marginRight: 1 }} /> Claim
                  </SuiButton>
                )}
                {t.claimed && <CheckCircleOutlined />}
              </SuiBox>
            ),
          },
        }));
        console.log(data);
        setRows(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Table
            columns={[
              { title: "Token Name", name: "token_name", align: "left" },
              { title: "Symbol", name: "symbol", align: "left" },
              { title: "Total Supply", name: "total_supply", align: "left" },
              { title: "Vesting Start Time", name: "vesting_start_time", align: "center" },
              { title: "Vesting End Time", name: "vesting_end_time", align: "center" },
              { title: "Vesting Interval (days)", name: "vesting_interval", align: "center" },
              { title: "", name: "action", align: "center" },
            ]}
            rows={rows}
          />
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};

export default observer(MyTokenContainer);
