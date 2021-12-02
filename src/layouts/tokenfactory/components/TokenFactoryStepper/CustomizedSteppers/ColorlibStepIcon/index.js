/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react";
import PropTypes from "prop-types";
import {
  AccountTreeOutlined,
  AddchartOutlined,
  DoneAllOutlined,
  HowToRegOutlined,
  RuleOutlined,
} from "@mui/icons-material";
import { ColorlibStepIconRoot } from "./styles";

const ColorlibStepIcon = (props) => {
  const { active, completed, className } = props;

  const icons = {
    1: <HowToRegOutlined />,
    2: <AccountTreeOutlined />,
    3: <AddchartOutlined />,
    4: <RuleOutlined />,
    5: <DoneAllOutlined />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
};

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};
export default ColorlibStepIcon;
