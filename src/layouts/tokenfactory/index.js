import TokenFactoryContainer from "./components/TokenFactoryContainer";
import { TokenFactoryProvider } from "./context/TokenFactoryContext";

export default function TokenFactory() {
  return (
    <TokenFactoryProvider>
      <TokenFactoryContainer />
    </TokenFactoryProvider>
  );
}
