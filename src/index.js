import 'regenerator-runtime/runtime';

import { initContract, login, logout, nearUtils } from './utils';
// import { BN } from 'bn.js';
const BN = require('bn.js');

console.log(new BN(10).pow(new BN(3)).toNumber());

import getConfig from './config';
import moment from 'moment';
const DEFAULT_GAS = 300000000000000;

const { networkId } = getConfig(process.env.NODE_ENV || 'development');

// global variable used throughout
let currentTotalDeposit;
let saleInfo;
let currentPeriod;
let currentUserSale;

const submitButton = document.querySelector('form button');

document.querySelector('form#abc').onsubmit = async (event) => {
    event.preventDefault();

    // get elements from the form using their id attribute
    const { fieldset, greeting } = event.target.elements;

    // disable the form while the value gets updated on-chain
    fieldset.disabled = true;

    try {
        
        // make an update call to the smart contract
        await window.contract.set_greeting({
            // pass the value that the user entered in the greeting field
            message: greeting.value
        });
    } catch (e) {
        alert(
            'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
        );
        throw e;
    } finally {
        // re-enable the form, whether the call succeeded or failed
        fieldset.disabled = false;
    }

    // disable the save button, since it now matches the persisted value
    submitButton.disabled = true;

    // update the greeting in the UI
    await fetchGreeting();

    // show notification
    document.querySelector('[data-behavior=notification]').style.display = 'block';

    // remove notification again after css animation completes
    // this allows it to be shown again next time the form is submitted
    setTimeout(() => {
        document.querySelector('[data-behavior=notification]').style.display = 'none';
    }, 11000);
}

document.querySelector('form#deposit').onsubmit = async (event) => {
    event.preventDefault();
    
    console.log(event.target.elements.deposit);
    let amount = event.target.elements.deposit.value;
    let res;

    try {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'block';
        res = await window.contract.deposit({}, DEFAULT_GAS, nearUtils.format.parseNearAmount(amount));
    } catch (e) {
        alert(
            'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
        );
        throw e;
    } finally {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'none';
    }
    console.log(res);
}

document.querySelector('form#withdraw').onsubmit = async (event) => {
    event.preventDefault();
    
    console.log(event.target.elements.withdraw);
    let amount = event.target.elements.withdraw.value;
    let res;

    try {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'block';
        res = await window.contract.withdraw({amount: nearUtils.format.parseNearAmount(amount)}, DEFAULT_GAS);
    } catch (e) {
        alert(
            'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
        );
        throw e;
    } finally {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'none';
    }
    console.log(res);
}

document.querySelector('form#redeem').onsubmit = async (event) => {
    event.preventDefault();
    
    console.log(event.target.elements.redeem);
    // let dec = new BN(10).pow(new BN(saleInfo.decimals));
    let amount = event.target.elements.redeem.value;
    // console.log(formatTokenAmount(amount, saleInfo.decimals));
    let res;

    try {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'block';
        res = await window.contract.redeem({request_num: formatTokenAmountToIndivisible(amount, saleInfo.decimals)}, DEFAULT_GAS);
    } catch (e) {
        alert(
            'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
        );
        throw e;
    } finally {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'none';
    }
    console.log(res);

    // show notification
    document.querySelector('[data-behavior=notification]').style.display = 'block';
    let viewTransactionLink = document.querySelector('[data-behavior=notification] a#view-transaction');
    viewTransactionLink.href = viewTransactionLink.href + "window.contract.res[0]";

    // remove notification again after css animation completes
    // this allows it to be shown again next time the form is submitted
    setTimeout(() => {
        document.querySelector('[data-behavior=notification]').style.display = 'none';
    }, 11000);
}

document.querySelectorAll('input#deposit, input#withdraw, input#redeem').forEach(elem => {
    elem.oninput = (event) => {
        let submitButton = elem.parentElement.querySelector('button');
        if (event.target.value !== "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }
});

document.querySelector('#sign-in-button').onclick = login;
document.querySelector('#sign-out-button').onclick = logout;

// Display the signed-out-flow container
function signedOutFlow() {
    document.querySelector('#signed-out-flow').style.display = 'block';
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
    document.querySelector('#signed-in-flow').style.display = 'block';

    document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
        el.innerText = window.accountId;
    })

    // populate links in the notification box
    const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)');
    accountLink.href = accountLink.href + window.accountId;
    accountLink.innerText = '@' + window.accountId;
    const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)');
    contractLink.href = contractLink.href + window.contract.contractId;
    contractLink.innerText = '@' + window.contract.contractId;

    // update with selected networkId
    accountLink.href = accountLink.href.replace('testnet', networkId);
    contractLink.href = contractLink.href.replace('testnet', networkId);

    fetchUserData();

}

async function fetchUserData() {
    try {
        document.querySelector('[data-behavior=waiting-for-transaction]').style.display = 'block';
        currentUserSale = await window.contract.get_user_sale();
        saleInfo = await window.contract.get_sale_info();
    } catch (e) {
        alert(
            'Something went wrong! ' +
            'Maybe you need to sign out and back in? ' +
            'Check your browser console for more info.'
        );
        throw e;
    } finally {
        document.querySelector('[data-behavior=notification]').style.display = 'none';
    }
    
    (
        document
        .querySelector('[data-behavior=max-redeemable]')
        .innerText = `${formatTokenAmountToHumanReadable(currentUserSale.redeemed_amount.toString(), saleInfo.decimals)} / ${formatTokenAmountToHumanReadable(currentUserSale.total_allocated_tokens.toString(), saleInfo.decimals)}`
    );
}

async function fetchContractStatus() {
    currentTotalDeposit = await window.contract.get_total_deposit();
    saleInfo = await window.contract.get_sale_info();
    currentPeriod = await window.contract.check_sale_status();

    console.log(currentTotalDeposit);
    console.log(saleInfo);
    console.log(currentPeriod);
    console.log(moment.duration(saleInfo.sale_duration/1000000).humanize());
    (
        document
        .querySelector('[data-behavior=total-deposit]')
        .innerText = currentTotalDeposit.formatted_amount
    );
    (
        document
        .querySelector('[data-behavior=ft-contract-name]')
        .innerText = saleInfo.ft_contract_name
    );
    (
        document
        .querySelector('[data-behavior=num-of-tokens]')
        .innerText = saleInfo.num_of_tokens
    );
    (
        document
        .querySelector('[data-behavior=start-time]')
        .innerText = new Date(saleInfo.start_time/1000000).toISOString()
    );
    (
        document
        .querySelector('[data-behavior=sale-duration]')
        .innerText = moment.duration(saleInfo.sale_duration/1000000).humanize()
    );
    (
        document
        .querySelector('[data-behavior=grace-duration]')
        .innerText = moment.duration(saleInfo.grace_duration/1000000).humanize()
    );
    (
        document
        .querySelector('[data-behavior=current-period]')
        .innerText = currentPeriod
    );

}

function formatTokenAmountToIndivisible(amt, decimals) {
    if (!amt) {
        return null;
    }
    // amt = cleanupAmount(amt);
    const split = amt.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > decimals) {
        throw new Error(`Cannot parse '${amt}' as NEAR amount`);
    }
    // return trimLeadingZeroes(wholePart + fracPart.padEnd(decimals, '0'));
    return wholePart + fracPart.padEnd(decimals, '0');
}

function formatTokenAmountToHumanReadable(balance, decimals) {
    const balanceBN = new BN(balance, 10);
    balance = balanceBN.toString();
    const wholeStr = balance.substring(0, balance.length - decimals) || '0';
    const fractionStr = balance.substring(balance.length - decimals)
        .padStart(decimals, '0').substring(0, decimals);
    return `${wholeStr}.${fractionStr}`.replace(/\.?0*$/, '');
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
    .then(() => {
        // initialFlow();
        fetchContractStatus();
        
        // document.querySelector('[data-behavior=total-deposit]').innerText = currentTotalDeposit;
        if (window.walletConnection.isSignedIn()) {
            signedInFlow();
        }
        else {
            signedOutFlow();
        }
    })
    .catch(console.error);
