/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  // Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
// import SuiInput from "components/SuiInput";
// import SuiTypography from "components/SuiTypography";
import React from "react";
// import SuiBox from "components/SuiBox";
import { Box } from "@mui/system";
import { green } from "@mui/material/colors";

const SalesForm = (props) => {
  const { label, disabled, loading, buttonDisable, defaultValue, onTextChange, onButtonClick } =
    props;

  return (
    <Container
      component="div"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%", marginTop: "10px" }}
    >
      {/* <SuiBox mb={2}>
        <SuiBox mb={1} ml={0.5}>
          <SuiBox display="flex" flexDirection="column">
            <SuiTypography component="label" variant="caption" fontWeight="bold">
              Deposit
            </SuiTypography>
            <SuiInput type="number" placeholder="Deposit" />
          </SuiBox>
        </SuiBox>
      </SuiBox> */}
      <FormControl disabled={disabled} fullWidth sx={{ m: 1 }} variant="outlined">
        <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${label}`}
          type="number"
          value={defaultValue}
          onChange={onTextChange}
          startAdornment={<InputAdornment position="start">NEAR</InputAdornment>}
          label={label}
        />
      </FormControl>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Box sx={{ m: 1, position: "relative" }}>
        <Button
          variant="contained"
          // sx={buttonSx}
          disabled={disabled || buttonDisable}
          onClick={onButtonClick}
        >
          Submit
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Container>
  );
};

export default SalesForm;
