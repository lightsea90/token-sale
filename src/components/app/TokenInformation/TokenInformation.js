import React, { useContext, useState } from 'react'
import { Container, Skeleton, Typography } from "@mui/material";
import { TokenSalesContext } from "../../../contexts/TokenSalesContext";
import { TokenUtils } from '../../../helpers/TokenUtils';
import moment from 'moment';
import { observer } from 'mobx-react';

let TokenInformation = (props) => {
    const { tokenStore } = useContext(TokenSalesContext);
    const { tokenContract } = tokenStore;

    return (
        tokenContract ?
            (<Container>
                <Typography variant="h6" component="div">Token: {tokenContract.tokenInfo.symbol}</Typography>
                <Typography variant="h6" component="div">Contract: {tokenContract.saleInfo.ft_contract_name}</Typography>
                <Typography variant="h6" component="div">Number of tokens for sale: {TokenUtils.formatTokenAmountToHumanReadable(tokenContract.saleInfo.num_of_tokens.toString(), tokenContract.tokenInfo.decimals)}</Typography>
                <Typography variant="h6" component="div">Start time: {new Date(tokenContract.saleInfo.start_time / 1000000).toDateString()}</Typography>
                <Typography variant="h6" component="div">Sale duration: {moment.duration(tokenContract.saleInfo.sale_duration / 1000000).humanize()}</Typography>
                <Typography variant="h6" component="div">Grace duration: {moment.duration(tokenContract.saleInfo.grace_duration / 1000000).humanize()}</Typography>
                <Typography variant="h6" component="div">Current period: {tokenStore.period}</Typography>
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