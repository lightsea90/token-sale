import { TokenFactoryProvider } from "layouts/tokenfactory/context/TokenFactoryContext";

import { observer } from "mobx-react";
import DashboardTokenContainer from "./DashboardTokenContainer";
// import SuiButton from "components/SuiButton";

const DashboardToken = () => (
  <TokenFactoryProvider>
    <DashboardTokenContainer />
  </TokenFactoryProvider>
);
export default observer(DashboardToken);
