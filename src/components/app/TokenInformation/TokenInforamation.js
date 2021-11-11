import { Container } from "@mui/material";

export default TokenInformation = (props) => {
    const [symbol, contractName, numberOfTokens, startTime, saleDuration, graceDuration, currentPeriod, totalDeposit, tokenPrice] = props;
    return (
        <Container>
            <p>Token: {symbol}</p>
            <p>Contract: {contractName}</p>
            <p>Number of tokens for sale: {numberOfTokens}</p>
            <p>Start time: {startTime}</p>
            <p>Sale duration: {saleDuration}</p>
            <p>Grace duration: {graceDuration}</p>
            <p>Current period: {currentPeriod}</p>
            <p>Total deposit: {totalDeposit}</p>
            <p>Price: {tokenPrice}</p>
        </Container>
    );
}