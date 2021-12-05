import { TokenFactoryProvider } from "layouts/tokenfactory/context/TokenFactoryContext";

import { observer } from "mobx-react";
import MyTokenContainer from "./MyTokenContainer";
// import SuiButton from "components/SuiButton";

const MyToken = () => (
  <TokenFactoryProvider>
    <MyTokenContainer />
  </TokenFactoryProvider>
);
export default observer(MyToken);
