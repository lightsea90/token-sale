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

export const resizeImage = (settings) => {
  const { file } = settings;
  const { maxSize } = settings;
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = () => {
    let { width } = image;
    let { height } = image;
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    return dataUrl;
  };
  return new Promise((ok, no) => {
    if (!file.type.match(/image.*/)) {
      no(new Error("Not an image"));
      return;
    }
    reader.onload = (readerEvent) => {
      image.onload = () => ok(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};
