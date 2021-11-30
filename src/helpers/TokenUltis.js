/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */

// eslint-disable-next-line import/no-extraneous-dependencies
const BN = require("bn.js");

export const formatTokenAmountToHumanReadable = (balance, decimals) => {
  const balanceBN = new BN(balance, 10);
  balance = balanceBN.toString();
  const wholeStr = balance.substring(0, balance.length - decimals) || "0";
  const fractionStr = balance
    .substring(balance.length - decimals)
    .padStart(decimals, "0")
    .substring(0, decimals);
  return `${wholeStr}.${fractionStr}`.replace(/\.?0*$/, "");
};
