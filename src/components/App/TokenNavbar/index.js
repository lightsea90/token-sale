import { useState, useEffect, useContext } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

import SuiBox from "components/SuiBox";
import Breadcrumbs from "examples/Breadcrumbs";
// import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";

// Custom styles for TokenNavbar
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
// Images
import { observer } from "mobx-react";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu } from "./styles";
// Images

function TokenNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const route = useLocation().pathname.split("/").slice(1);
  const { tokenStore } = useContext(TokenSalesContext);
  const { tokenState } = tokenStore;

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    /** 
         The event listener that's calling the handleTransparentNavbar function when 
         scrolling the window.
        */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleLoginClick = () => {
    tokenStore.login();
  };
  const handleLogoutClick = () => {
    tokenStore.logout();
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </SuiBox>
        {isMini ? null : (
          <SuiBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <SuiBox pr={1}>
              <SuiInput
                placeholder="Type here..."
                icon={{ component: "search", direction: "left" }}
              />
            </SuiBox> */}
            <SuiBox color={light ? "white" : "inherit"}>
              <IconButton sx={navbarIconButton} size="medium" onClick={handleLoginClick}>
                <Icon
                  sx={({ palette: { dark, white } }) => ({
                    color: light ? white.main : dark.main,
                  })}
                >
                  account_circle
                </Icon>
                <SuiTypography
                  variant="button"
                  fontWeight="medium"
                  color={light ? "white" : "dark"}
                >
                  {tokenStore?.isSignedIn
                    ? `Welcome ${tokenState?.walletConnection?.getAccountId()}!`
                    : " Connect wallet"}
                </SuiTypography>
              </IconButton>
              <IconButton
                size="medium"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="medium"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton>
              {tokenStore?.isSignedIn && (
                <IconButton
                  size="medium"
                  color="error"
                  sx={navbarIconButton}
                  onClick={handleLogoutClick}
                >
                  <Icon>logout</Icon>
                </IconButton>
              )}
            </SuiBox>
          </SuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of TokenNavbar
TokenNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the TokenNavbar
TokenNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default observer(TokenNavbar);
