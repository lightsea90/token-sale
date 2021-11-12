import { useContext, useEffect, useState } from "react";
import Home from "./components/app/Home/Home";
import Login from "./components/app/Login/Login";
import { TokenSalesContext } from "./contexts/TokenSalesContext";

export default App = (props) => {
  const {
    tokenState: {
      walletConnection,
      accountId,
      contract,
      tokenContract
    },
    setTokenState,
    nearUtils,
    initContract,
    initTokenContract,
    login,
    logout
  } = useContext(TokenSalesContext);

  const [isSingedIn, setIsSignedIn] = useContext(false);

  //use hook to store greeting in component state
  const [greeting, setGreeting] = useState();

  //when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = useState();

  //after submitting the from, we want to show notification
  const [showNotification, setShowNotification] = useState();
  
  const fetchUserData = () => { };
  const fetchContractStatus = () => { };

  // The useEffect hook can be used to fire side-effects during render
  useEffect(async () => {
    await initContract();
    await fetchContractStatus();
    if (walletConnection?.isSingedIn()) {
      await fetchUserData();
      setIsSignedIn(walletConnection.isSingedIn());
    }

  }, []);
  useEffect(() => { }, [isSingedIn]);

  return (
    <Container>
      {isSingedIn ? <Home logout={logout} /> : <Login login={login} />}
      {showNotification && <Notification />}
    </Container>
  )
}