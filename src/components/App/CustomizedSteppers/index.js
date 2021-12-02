import { Stack, Step, StepLabel, Stepper } from "@mui/material";
import PropTypes from "prop-types";
import ColorlibStepIcon from "./ColorlibStepIcon";
import { ColorlibConnector } from "./ColorlibStepIcon/styles";

const stepsData = ["Select campaign settings", "Create an ad group", "Create an ad"];

const CustomizedSteppers = (props) => {
  let { steps, activeStep } = props;
  steps = stepsData;
  activeStep = 0;
  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};

CustomizedSteppers.defaultProps = {
  steps: [],
  activeStep: 0,
};

CustomizedSteppers.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string),
  activeStep: PropTypes.number,
};

export default CustomizedSteppers;
