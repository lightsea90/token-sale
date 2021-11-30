import TokenSalesContainer from "./components/TokenSalesContainer";
import { TokenSalesProvider } from "./context/TokenSalesContext";

export default function TokenSales() {
  return (
    <TokenSalesProvider>
      <TokenSalesContainer />
    </TokenSalesProvider>
  );
}
