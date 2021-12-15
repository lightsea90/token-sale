/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Avatar, Card, Grid, MenuItem, Paper, Select, TextField } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { useContext, useEffect, useReducer, useState } from "react";
import { humanize } from "humanize";
import { DateTimePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { observer } from "mobx-react";
import { AddAPhotoOutlined, BackupOutlined, DeleteOutlined } from "@mui/icons-material";
import Dropzone, { useDropzone } from "react-dropzone";
import { resizeImage } from "helpers/TokenUltis";

const CreateToken = (props) => {
  const { setAlert } = props;
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const [vestingStartTime, setVestingStartTime] = useState();
  const [vestingEndTime, setVestingEndTime] = useState(moment().add(30, "days"));
  // eslint-disable-next-line react/destructuring-assignment
  const [loading, setLoading] = useState(props.loading || false);
  const [totalSupply, setTotalSupply] = useState(tokenFactoryStore.registerParams.total_supply);
  const [tokenValidation, setTokenValidation] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // eslint-disable-next-line no-debugger
      resizeImage({ file: acceptedFiles[0], maxSize: 32 }).then((result) => {
        tokenFactoryStore.token.icon = result;
      });
    },
  });

  const { ref, ...rootProps } = getRootProps();

  const checkTokenValidation = async () => {
    let isValid = true;
    if (!tokenFactoryStore.token.tokenName || !tokenFactoryStore.token.symbol) {
      isValid = false;
      return isValid;
    }
    try {
      await tokenFactoryStore.checkExistenceToken(tokenFactoryStore.registerParams.ft_contract);
      await tokenFactoryStore.checkExistenceToken(
        tokenFactoryStore.registerParams.deployer_contract
      );
    } catch (error) {
      console.log(error);
      if (error?.type !== "AccountDoesNotExist") {
        isValid = false;
      }
    }

    return isValid;
  };

  useEffect(() => {
    setLoading(tokenFactoryStore.activeStep > -1 && tokenFactoryStore.activeStep <= 4);
  }, [tokenFactoryStore.activeStep]);

  useEffect(() => {
    if (window.delayCheckTokenValidation) clearTimeout(window.delayCheckTokenValidation);
    window.delayCheckTokenValidation = setTimeout(async () => {
      const res = await checkTokenValidation();
      setTokenValidation(res);
    }, 500);
  }, [tokenFactoryStore.token.symbol, tokenFactoryStore.token.tokenName]);

  const handleTokenNameChange = (e) => {
    tokenFactoryStore.setToken({ tokenName: e.target.value });
  };

  const handleSymbolChange = (e) => {
    tokenFactoryStore.setToken({ symbol: e.target.value.toUpperCase() });
  };

  const handleInitialSupplyChange = (e) => {
    setTotalSupply(e.target.value * 10 ** tokenFactoryStore.token.decimal);
    tokenFactoryStore.setToken({ initialSupply: e.target.value });
  };

  const handleDecimalChange = (e) => {
    setTotalSupply(tokenFactoryStore.token.initialSupply * 10 ** e.target.value);
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

  // const handleVestingEndTimeChange = (value) => {
  //   setVestingEndTime(value);
  //   tokenFactoryStore.setToken({ vestingEndTime: value });
  // };

  const handleVestingDurationChange = (e) => {
    setVestingEndTime(
      moment(vestingStartTime).add(e.target.value, "days").format("DD/MM/YY hh:mm a")
    );
    tokenFactoryStore.setToken({ vestingDuration: e.target.value });
  };

  const handleVestingIntervalChange = (e) => {
    tokenFactoryStore.setToken({ vestingInterval: e.target.value });
  };

  const handleRegisterToken = async () => {
    try {
      setLoading(true);
      await tokenFactoryStore.register();
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
        <Card sx={{ margin: "auto", flexGrow: 10, p: 4 }}>
          <Grid container>
            <Grid item xs={6} sx={{ pr: 1 }}>
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
                    value={tokenFactoryStore.token.tokenName}
                  />
                </SuiBox>
                <SuiBox mb={3}>
                  <Grid container>
                    <Grid item xs={6} sx={{ pr: 1 }}>
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
                        value={tokenFactoryStore.token.symbol}
                      />
                    </Grid>
                    <Grid item xs={6} sx={{ pr: 1 }}>
                      <SuiBox mb={1} ml={0.5}>
                        <SuiTypography component="label" variant="caption" fontWeight="bold">
                          Icon
                        </SuiTypography>
                      </SuiBox>
                      <SuiBox {...rootProps} sx={{ float: "left" }}>
                        <input {...getInputProps()} />
                        {tokenFactoryStore.token.icon !== null ? (
                          <SuiBox>
                            <img src={tokenFactoryStore.token.icon} />
                          </SuiBox>
                        ) : (
                          <AddAPhotoOutlined fontSize="large" />
                        )}
                      </SuiBox>
                      {tokenFactoryStore.token.icon && (
                        <DeleteOutlined
                          sx={{ float: "right" }}
                          fontSize="medium"
                          onClick={() => {
                            tokenFactoryStore.token.icon = null;
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </SuiBox>
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <Grid container direction="row" justifyContent="space-between">
                      <SuiTypography component="label" variant="caption" fontWeight="bold" mb={1}>
                        Total Supply
                      </SuiTypography>
                      <SuiTypography component="label" variant="caption" align="right" color="red">
                        ~ {humanize.numberFormat(totalSupply)}
                      </SuiTypography>
                      {/* <Grid item xs={6} alignContent="start"></Grid>
                      <Grid item xs={6} alignContent="end" alignItems="end"></Grid> */}
                    </Grid>
                  </SuiBox>
                  <Select
                    disabled={loading}
                    value={tokenFactoryStore.token.initialSupply}
                    onChange={handleInitialSupplyChange}
                    input={<SuiInput />}
                  >
                    <MenuItem value={100000000}>{humanize.numberFormat(100000000)}</MenuItem>
                  </Select>
                  {/* <SuiInput
                    disabled={loading}
                    required
                    type="number"
                    placeholder="Initial Supply"
                    value={tokenFactoryStore.token.initialSupply}
                    // defaultValue={tokenFactoryStore.token.initialSupply}
                    onChange={handleInitialSupplyChange}
                  /> */}
                </SuiBox>
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <SuiTypography component="label" variant="caption" fontWeight="bold">
                      Decimals (1-18)
                    </SuiTypography>
                  </SuiBox>
                  <Select
                    disabled={loading}
                    value={tokenFactoryStore.token.decimal}
                    onChange={handleDecimalChange}
                    input={<SuiInput />}
                  >
                    <MenuItem value={8}>8</MenuItem>
                  </Select>
                  {/* <SuiInput
                    disabled={loading}
                    required
                    type="number"
                    defaultValue={tokenFactoryStore.token.decimal}
                    onChange={handleDecimalChange}
                  /> */}
                </SuiBox>
              </SuiBox>
            </Grid>
            <Grid item xs={6} sx={{ pr: 1 }}>
              <SuiBox component="form" role="form">
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
                    input={<SuiInput />}
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
                    input={<SuiInput />}
                  >
                    <MenuItem value={8}>8%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                  </Select>
                </SuiBox>
                <Grid container>
                  <Grid item xs={6}>
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
                  </Grid>
                  {/* <Grid item xs={6}>
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
                  </Grid> */}
                  <Grid item xs={6}>
                    <SuiBox mb={2}>
                      <SuiBox mb={1} ml={0.5}>
                        <SuiTypography component="label" variant="caption" fontWeight="bold">
                          Vesting Duration (days)
                        </SuiTypography>
                      </SuiBox>
                      <Select
                        disabled={loading}
                        value={tokenFactoryStore.token.vestingDuration}
                        onChange={handleVestingDurationChange}
                        input={<SuiInput />}
                      >
                        {/* <MenuItem value={1}>1</MenuItem> */}
                        <MenuItem value={4}>4</MenuItem>
                        {/* <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={30}>30</MenuItem> */}
                      </Select>
                    </SuiBox>
                  </Grid>
                </Grid>

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
                  <Select
                    disabled={loading}
                    value={tokenFactoryStore.token.vestingInterval}
                    onChange={handleVestingIntervalChange}
                    input={<SuiInput />}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    {/* <MenuItem value={7}>7</MenuItem> */}
                  </Select>
                  {/* <SuiInput
                    disabled={loading}
                    required
                    type="number"
                    defaultValue={tokenFactoryStore.token.vestingInterval}
                    onChange={handleVestingIntervalChange}
                  /> */}
                </SuiBox>
              </SuiBox>
            </Grid>
            <SuiBox mt={4} mb={1}>
              {/* <SuiButton
                disabled={loading || !tokenFactoryStore.tokenValidation}
                variant="gradient"
                color="primary"
                onClick={handleRegisterToken}
              >
                Create Token
              </SuiButton> */}
              <LoadingButton
                disabled={loading || !tokenValidation}
                sx={{
                  background: "linear-gradient(to left, #642b73, #c6426e)",
                  color: "#fff",
                }}
                onClick={handleRegisterToken}
                loading={loading}
                loadingPosition="start"
                startIcon={<BackupOutlined color="#fff" fontSize="large" />}
                variant="contained"
              >
                Create Token
              </LoadingButton>
            </SuiBox>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default observer(CreateToken);
