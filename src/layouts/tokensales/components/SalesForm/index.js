/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import {
  CircularProgress,
  Grid,
  // Grid,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
// import SuiInput from "components/SuiInput";
// import SuiTypography from "components/SuiTypography";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";
// import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import SuiBox from "components/SuiBox";
import PropTypes from "prop-types";
import SuiButton from "components/SuiButton";
import "./SalesForm.scss";

const SalesForm = (props) => {
  const {
    label,
    disabled,
    loading,
    // eslint-disable-next-line no-unused-vars
    buttonDisable,
    defaultValue,
    onTextChange,
    onButtonClick,
    adornment,
    buttonText,
  } = props;

  return (
    <SuiBox mb={2}>
      <SuiBox mb={1} ml={0.5}>
        <SuiBox component="form" role="form" className="sale-form">
          <SuiTypography component="label" variant="caption" fontWeight="bold">
            {label}
          </SuiTypography>
          <Grid container xs={12}>
            {/* <SuiInput type="number" placeholder="Deposit" onChange={onTextChange} /> */}
            <Grid item xs={10} sx={{ pr: 1 }}>
              <OutlinedInput
                className="sale-form-input"
                disabled={disabled}
                type="number"
                value={defaultValue}
                onChange={onTextChange}
                startAdornment={
                  <InputAdornment position="start" className="adornment">
                    {adornment}
                  </InputAdornment>
                }
                label={label}
                sx={{ width: "100% !important" }}
              />
            </Grid>
            <Grid item xs={2} sx={{ pr: 1 }}>
              <SuiButton
                color="primary"
                variant="gradient"
                disabled={disabled || buttonDisable}
                onClick={onButtonClick}
                sx={{ width: "100%" }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={14} sx={{ marginRight: 1 }} />
                ) : (
                  <CheckIcon sx={{ marginRight: 1 }} />
                )}
                {buttonText}
              </SuiButton>
            </Grid>
          </Grid>
        </SuiBox>
      </SuiBox>
    </SuiBox>
  );
};

SalesForm.propType = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  buttonDisable: PropTypes.bool,
  defaultValue: PropTypes.any,
  onTextChange: PropTypes.func.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  adornment: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
};
SalesForm.propDefault = {
  disabled: false,
  loading: false,
  buttonDisable: false,
  buttonText: "Submit",
};

export default SalesForm;
