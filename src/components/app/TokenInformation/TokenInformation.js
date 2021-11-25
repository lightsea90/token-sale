import React, { useContext, useEffect, useState } from 'react'
import { Container, Skeleton, Typography } from "@mui/material";
import { TokenSalesContext } from "../../../contexts/TokenSalesContext";
import { TokenUtils } from '../../../helpers/TokenUtils';
import moment from 'moment';
import { observer } from 'mobx-react';
import FlipCountdown from '@rumess/react-flip-countdown';

let TokenInformation = (props) => {
    const { tokenStore } = useContext(TokenSalesContext);
    const { tokenContract } = tokenStore;

    useEffect(() => {
        if (!window.countDownDeposit && tokenStore.countDownDeposit > 0) {
            window.countDownDeposit = setInterval(async () => {
                tokenStore.countDownDeposit--;
                if (tokenStore.countDownDeposit <= 0) {
                    clearInterval(window.countDownDeposit);
                    await tokenStore.fetchContractStatus(tokenStore.tokenState.contract, tokenStore.tokenState.walletConnection);
                }
            }, 1000);
        }
    }, [tokenStore.countDownDeposit]);

    useEffect(() => {
        if (!window.countDownWithdrawal && tokenStore.countDownWithdrawal > 0) {
            window.countDownWithdrawal = setInterval(async () => {
                tokenStore.countDownWithdrawal--;
                if (tokenStore.countDownWithdrawal <= 0) {
                    clearInterval(window.countDownWithdrawal);
                    await tokenStore.fetchContractStatus(tokenStore.tokenState.contract, tokenStore.tokenState.walletConnection);
                }
            }, 1000);
        }

    }, [tokenStore.countDownWithdrawal]);

    useEffect(() => {
        if (!window.countDownRedeem && tokenStore.countDownRedeem > 0) {
            window.countDownRedeem = setInterval(async () => {
                tokenStore.countDownRedeem--;
                if (tokenStore.countDownRedeem <= 0) {
                    clearInterval(window.countDownRedeem);
                    await tokenStore.fetchContractStatus(tokenStore.tokenState.contract, tokenStore.tokenState.walletConnection);
                }
            }, 1000);
        }
    }, [tokenStore.countDownRedeem]);

    return (
        tokenContract?.tokenInfo ?
            (<Container>
                <Typography variant="h6" component="div">Token: {tokenContract.tokenInfo.symbol}</Typography>
                <Typography variant="h6" component="div">Contract: {tokenContract.saleInfo.ft_contract_name}</Typography>
                <Typography variant="h6" component="div">Number of tokens for sale: {TokenUtils.formatTokenAmountToHumanReadable(tokenContract.saleInfo.num_of_tokens.toString(), tokenContract.tokenInfo.decimals)}</Typography>
                {/* <Typography variant="h6" component="div">Start time: {new Date(tokenContract.saleInfo.start_time / 1000000).toISOString()}{countDownDeposit > 0 ? `. After : ${countDownDeposit}` : ''}</Typography> 
                <Typography variant="h6" component="div">Sale duration: {moment.duration(tokenContract.saleInfo.sale_duration / 1000000).humanize()}{countDownWithdraw > 0 ? ` . After : ${countDownWithdraw}` : ''}</Typography>
                <Typography variant="h6" component="div">Grace duration: {moment.duration(tokenContract.saleInfo.grace_duration / 1000000).humanize()}{countDownRedeem > 0 ? ` . After : ${countDownRedeem}` : ''}</Typography>*/}
                <Typography variant="h6" component="div">Start time: <FlipCountdown theme="light" hideYear hideMonth endAtZero size="small" endAt={tokenStore.depositTime} /> </Typography>
                <Typography variant="h6" component="div">Sale time: <FlipCountdown theme="light" hideYear hideMonth endAtZero size="small" endAt={tokenStore.withdrawalTime} /> </Typography>
                <Typography variant="h6" component="div">Grace time: <FlipCountdown theme="light" hideYear hideMonth endAtZero size="small" endAt={tokenStore.redeemTime} /> </Typography>
                <Typography variant="h6" component="div">Current period: {tokenContract.tokenPeriod}</Typography>
                <Typography variant="h6" component="div">Total deposit: {tokenContract.totalDeposit.formatted_amount}</Typography>
                <Typography variant="h6" component="div">Price: {tokenContract.totalDeposit.formatted_amount / TokenUtils.formatTokenAmountToHumanReadable(tokenContract.saleInfo.num_of_tokens.toString(), tokenContract.tokenInfo.decimals)}</Typography>

            </Container>) : (<Container>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
            </Container>)
    );
}
TokenInformation = observer(TokenInformation);
export default TokenInformation;