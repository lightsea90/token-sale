import { useEffect, useState } from "react";

export default App = () => {

  //use hook to store greeting in component state
  const [greeting, setGreeting] = useState();

  //when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = useState();

  //after submitting the from, we want to show notification
  const [showNotification, setShowNotification] = useState();


  const handleSignedIn = () => { };
  const handleSignedOut = () => { };
  const fetchUserData = () => { };
  const fetchContractStatus = () => { };

  // The useEffect hook can be used to fire side-effects during render
  useEffect(() => {
    if (window.walletConnection.isSignedIn()) {

      // window.contract is set by initContract in index.js
      window.contract.getGreeting({ accountId: window.accountId })
        .then(greetingFromContract => {
          setGreeting(greetingFromContract)
        })
    }
  }, []);
}