// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SuiBox from "components/SuiBox";
import SuiTypography from "components/SuiTypography";
import FlipCountdown from "@rumess/react-flip-countdown";
import "./PeriodCard.scss";

function PeriodCard({ bgColor, title, period, countDown, icon, direction }) {
  return (
    <Card>
      <SuiBox bgColor={bgColor} variant="gradient">
        <SuiBox p={2}>
          <Grid container alignItems="center">
            {direction === "left" ? (
              <Grid item>
                <SuiBox
                  variant="gradient"
                  bgColor={bgColor === "white" ? icon.color : "white"}
                  color={bgColor === "white" ? "white" : "dark"}
                  width="3rem"
                  height="3rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="small" color="inherit">
                    {icon.component}
                  </Icon>
                </SuiBox>
              </Grid>
            ) : null}
            <Grid item xs={8}>
              <SuiBox ml={direction === "left" ? 2 : 0} lineHeight={1}>
                <SuiTypography
                  variant="button"
                  color={bgColor === "white" ? "text" : "white"}
                  opacity={bgColor === "white" ? 1 : 0.7}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                >
                  {title.text}
                </SuiTypography>
                {countDown ? (
                  <FlipCountdown
                    theme="light"
                    hideYear
                    hideMonth
                    endAtZero
                    size="small"
                    endAt={countDown}
                  />
                ) : (
                  <SuiTypography
                    variant="h5"
                    fontWeight="bold"
                    color={bgColor === "white" ? "dark" : "white"}
                  >
                    {period}{" "}
                    {/* <SuiTypography variant="button" color={percentage.color} fontWeight="bold">
                        {percentage.text}
                      </SuiTypography> */}
                  </SuiTypography>
                )}
              </SuiBox>
            </Grid>
            {direction === "right" ? (
              <Grid item xs={4}>
                <SuiBox
                  variant="gradient"
                  bgColor={bgColor === "white" ? icon.color : "white"}
                  color={bgColor === "white" ? "white" : "dark"}
                  width="3rem"
                  height="3rem"
                  marginLeft="auto"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                >
                  <Icon fontSize="small" color="inherit">
                    {icon.component}
                  </Icon>
                </SuiBox>
              </Grid>
            ) : null}
          </Grid>
        </SuiBox>
      </SuiBox>
    </Card>
  );
}

// Setting default values for the props of PeriodCard
PeriodCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "medium",
    text: "",
  },
  countDown: "",
  //   percentage: {
  //     color: "success",
  //     text: "",
  //   },
  direction: "right",
};

// Typechecking props for the PeriodCard
PeriodCard.propTypes = {
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
  }),
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  countDown: PropTypes.oneOfType([PropTypes.string]),
  //   percentage: PropTypes.shape({
  //     color: PropTypes.oneOf([
  //       "primary",
  //       "secondary",
  //       "info",
  //       "success",
  //       "warning",
  //       "error",
  //       "dark",
  //       "white",
  //     ]),
  //     text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  //   }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(["right", "left"]),
};

export default PeriodCard;
