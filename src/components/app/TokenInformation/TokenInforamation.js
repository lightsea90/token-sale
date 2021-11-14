import React, { useContext, useState } from 'react'
import { Typography } from "@mui/material";
import { TokenSalesContext } from "../../../contexts/TokenSalesContext";
import { TokenUtils } from '../../../helpers/TokenUtils';
import moment from 'moment';

const TokenInformation = (props) => {
    const {
        tokenContract
    } = useContext(TokenSalesContext);
    const { saleInfo, tokenPeriod, totalDeposit, tokenInfo } = tokenContract;
    const { symbol, decimals } = tokenInfo;

    return (
        <>
            <Typography variant="h6" component="div">Token: {symbol}</Typography>
            <Typography variant="h6" component="div">Contract: {saleInfo.ft_contract_name}</Typography>
            <Typography variant="h6" component="div">Number of tokens for sale: {TokenUtils.formatTokenAmountToHumanReadable(saleInfo.num_of_tokens.toString(), decimals)}</Typography>
            <Typography variant="h6" component="div">Start time: {new Date(saleInfo.start_time / 1000000).toDateString()}</Typography>
            <Typography variant="h6" component="div">Sale duration: {moment.duration(saleInfo.sale_duration / 1000000).humanize()}</Typography>
            <Typography variant="h6" component="div">Grace duration: {moment.duration(saleInfo.grace_duration / 1000000).humanize()}</Typography>
            <Typography variant="h6" component="div">Current period: {tokenPeriod}</Typography>
            <Typography variant="h6" component="div">Total deposit: {totalDeposit.formatted_amount}</Typography>
            <Typography variant="h6" component="div">Price: {totalDeposit.formatted_amount / TokenUtils.formatTokenAmountToHumanReadable(saleInfo.num_of_tokens.toString(), decimals)}</Typography>
        </>
    );
}
export default TokenInformation;