import { Container } from "@mui/material"

export default Home = () => {
    return (
        <Container>
            <button class="button" style="float: right; background: red" id="sign-out-button">
                Sign out
            </button>
            <main>
                <h1>
                    <label style="color: rebeccapurple;">
                        Welcome to TokenHub
                    </label>
                    <span data-behavior="account-id"></span>!
                </h1>
                <form id="abc"></form>
                <form id="deposit">
                    <label
                        for="deposit"
                        style="display: block; color: var(--gray); margin-bottom: 0.5em"
                    >
                        Deposit: <span data-behavior="my-deposit"></span>
                    </label>
                    <div style="display: flex">
                        <input
                            style="flex: 1"
                            autocomplete="off"
                            id="deposit"
                            data-behavior="deposit"
                        />
                        <button disabled style="border-radius: 0 5px 5px 0">Submit</button>
                    </div>
                </form>

                <form id="withdraw">
                    <label
                        for="withdraw"
                        style="display: block; color: var(--gray); margin-bottom: 0.5em"
                    >
                        Withdraw:
                    </label>
                    <div style="display: flex">
                        <input
                            style="flex: 1"
                            autocomplete="off"
                            id="withdraw"
                            data-behavior="withdraw"
                        />
                        <button disabled style="border-radius: 0 5px 5px 0">Submit</button>
                    </div>
                </form>

                <form id="redeem">
                    <div style="display: flex">
                        <label
                            for="redeem"
                            style="display: block; color: var(--gray); margin-bottom: 0.5em"
                        >
                            Redeem:
                        </label>
                        <!-- <span data-behavior="max-redeemable"></span> -->
                    </div>

                    <div style="display: flex">
                        <input
                            style="flex: 1"
                            autocomplete="off"
                            id="redeem"
                            data-behavior="redeem"
                            disabled
                        />
                        <button disabled style="border-radius: 0 5px 5px 0">Submit</button>
                    </div>
                </form>
            </main>
        </Container>
    )
}