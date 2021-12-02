/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Grid, MenuItem, NativeSelect, Select, Stack, TextField } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { useContext, useState } from "react";
import { humanize } from "humanize";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import SuiAlert from "components/SuiAlert";

const CreateToken = (props) => {
  const { tokenFactoryStore } = useContext(TokenFactoryContext);

  const [vestingStartTime, setVestingStartTime] = useState();

  const [vestingEndTime, setVestingEndTime] = useState();

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({});

  const handleTokenNameChange = (e) => {
    tokenFactoryStore.setToken({ tokenName: e.target.value });
  };

  const handleSymbolChange = (e) => {
    tokenFactoryStore.setToken({ symbol: e.target.value.toUpperCase() });
  };

  const handleInitialSupplyChange = (e) => {
    tokenFactoryStore.setToken({ initialSupply: e.target.value });
  };

  const handleDecimalChange = (e) => {
    tokenFactoryStore.setToken({ decimal: e.target.value });
  };

  const handleInitialReleasePercentChange = (e) => {
    tokenFactoryStore.setToken({ initialRelease: e.target.value });
  };

  const handleTreasuryPercentChange = (e) => {
    tokenFactoryStore.setToken({ treasury: e.target.value });
  };

  const handleVestingStartTimeChange = (value) => {
    setVestingStartTime(value);
    tokenFactoryStore.setToken({ vestingStartTime: value });
  };
  const handleVestingEndTimeChange = (value) => {
    setVestingEndTime(value);
    tokenFactoryStore.setToken({ vestingEndTime: value });
  };
  const handleVestingIntervalChange = (value) => {
    tokenFactoryStore.setToken({ vestingInterval: value });
  };

  const handleRegisterToken = async () => {
    try {
      setLoading(true);
      await tokenFactoryStore.register();
      await tokenFactoryStore.createContract();
      await tokenFactoryStore.createDeployerContract();
      await tokenFactoryStore.issue();
      await tokenFactoryStore.initTokenAllocation();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setAlert({
        open: true,
        message: error.message,
        color: "error",
      });
    }
  };

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
              <SuiInput
                disabled={loading}
                required
                type="text"
                placeholder="Token Name"
                onChange={handleTokenNameChange}
                defaultValue={tokenFactoryStore.token.tokenName}
              />
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Symbol
                </SuiTypography>
              </SuiBox>
              <SuiInput
                disabled={loading}
                required
                type="text"
                placeholder="Symbol"
                onChange={handleSymbolChange}
                defaultValue={tokenFactoryStore.token.symbol}
              />
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Initial Supply
                </SuiTypography>
              </SuiBox>
              <SuiInput
                disabled={loading}
                required
                type="number"
                placeholder="Initial Supply"
                defaultValue={tokenFactoryStore.token.initialSupply}
                onChange={handleInitialSupplyChange}
              />
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                ~ {humanize.numberFormat(tokenFactoryStore.registerParams.total_supply)}
              </SuiTypography>
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Decimals (1-18)
                </SuiTypography>
              </SuiBox>
              <SuiInput
                disabled={loading}
                required
                type="number"
                defaultValue={tokenFactoryStore.token.decimal}
                onChange={handleDecimalChange}
              />
            </SuiBox>
            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Initial Release
                </SuiTypography>
              </SuiBox>
              <Select
                disabled={loading}
                value={tokenFactoryStore.token.initialRelease}
                onChange={handleInitialReleasePercentChange}
              >
                <MenuItem value={15}>15%</MenuItem>
                <MenuItem value={20}>20%</MenuItem>
                <MenuItem value={25}>25%</MenuItem>
              </Select>
            </SuiBox>

            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Treasury
                </SuiTypography>
              </SuiBox>
              <Select
                disabled={loading}
                value={tokenFactoryStore.token.treasury}
                onChange={handleTreasuryPercentChange}
              >
                <MenuItem value={8}>8%</MenuItem>
                <MenuItem value={10}>10%</MenuItem>
                <MenuItem value={15}>15%</MenuItem>
              </Select>
            </SuiBox>

            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Vesting Start Time
                </SuiTypography>
              </SuiBox>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled={loading}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={handleVestingStartTimeChange}
                  value={vestingStartTime}
                />
              </LocalizationProvider>
            </SuiBox>

            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography component="label" variant="caption" fontWeight="bold">
                  Vesting End Time
                </SuiTypography>
              </SuiBox>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  disabled={loading}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={handleVestingEndTimeChange}
                  value={vestingEndTime}
                />
              </LocalizationProvider>
            </SuiBox>

            <SuiBox mb={2}>
              <SuiBox mb={1} ml={0.5}>
                <SuiTypography
                  disabled={loading}
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                >
                  Vesting Interval (Days)
                </SuiTypography>
              </SuiBox>
              <SuiInput
                disabled={loading}
                required
                type="number"
                defaultValue={tokenFactoryStore.token.vestingInterval}
                onChange={handleVestingIntervalChange}
              />
            </SuiBox>

            <SuiBox mt={4} mb={1}>
              <SuiButton
                disabled={loading}
                variant="gradient"
                color="info"
                onClick={handleRegisterToken}
              >
                Create Token
              </SuiButton>
            </SuiBox>
            {alert.open && (
              <SuiAlert color={alert.color} dismissible>
                {alert.message}
              </SuiAlert>
            )}
          </SuiBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CreateToken;
