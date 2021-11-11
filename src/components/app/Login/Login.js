import { Container } from "@mui/material"

export default Login = (props) => {
    return (
        <Container>
            <h1>Welcome to TokenHub!</h1>
            <p style="text-align: center;">
                We based on NEAR Protocol. Please sign in by your Near wallet if you want to join us.
            </p>
            <p style="text-align: center; margin-top: 2.5em">
                <button id="sign-in-button">Sign in</button>
            </p>
        </Container>
    )
}