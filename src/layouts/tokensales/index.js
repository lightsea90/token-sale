import { observer } from "mobx-react";
import TokenSalesContainer from "./components/TokenSalesContainer";
import { TokenSalesProvider } from "./context/TokenSalesContext";

const TokenSales = () => (
  <TokenSalesProvider>
    <TokenSalesContainer />
  </TokenSalesProvider>
);
export default observer(TokenSales);
