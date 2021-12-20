import web3 from "../web3";
import ContratInterface, {
  contractAddress,
} from "../interface/routertInterface";
import tokenInterface from "../interface/tokenInterface";
import ABI from "../abi/router.json";
import Web3 from "web3";

export const swap = async (
  amountIn,
  amountOutMin,
  path,
  userAddress,
  deadline,
  walletType,
  exchangeType
) => {
  try {
    let myContract = await ContratInterface(walletType);
    let receipt;

    if (exchangeType === "ETHtoToken") {
      receipt = await myContract.methods
        .swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOutMin,
          path,
          userAddress,
          deadline
        )
        .send({ from: userAddress, value: amountIn });
    } else if (exchangeType === "tokenToEth") {
      receipt = await myContract.methods
        .swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          path,
          userAddress,
          deadline
        )
        // .estimateGas({ from: userAddress });
        .send({ from: userAddress });
    } else if (exchangeType === "tokenToToken") {
      if (
        path[0] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" &&
        path[1] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
      ) {
        path[2] = path[1];
        path[1] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
      }
      receipt = await myContract.methods
        .swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          path,
          userAddress,
          deadline
        )
        .send({ from: userAddress });
    }

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const getQuote = async (amount, path, walletType, quoteType) => {
  try {
    let myContract = await ContratInterface(walletType);
    let receipt;

    if (quoteType === "amountIn") {
      if (
        path[0] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" &&
        path[1] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
      ) {
        path[2] = path[1];
        path[1] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
      }
      receipt = await myContract.methods.getAmountsIn(amount, path).call();
    } else if (quoteType === "amountOut") {
      if (
        path[0] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" &&
        path[1] !== "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
      ) {
        path[2] = path[1];
        path[1] = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
      }
      receipt = await myContract.methods.getAmountsOut(amount, path).call();
    }

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const Approve = async (walletType, userAddress, address) => {
  try {
    let myContract = await tokenInterface(walletType, address);
    let amount = web3.utils.toWei("999999999999999999");
    let receipt = await myContract.methods
      .approve(contractAddress, amount)
      .send({ from: userAddress });

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const checkAllowance = async (walletType, userAddress, address) => {
  try {
    let myContract = await tokenInterface(walletType, address);
    let receipt = await myContract.methods
      .allowance(userAddress, contractAddress)
      .call();

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const checkBalance = async (walletType, userAddress, address) => {
  try {
    let myContract = await tokenInterface(walletType, address);
    let receipt = await myContract.methods.balanceOf(userAddress).call();

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const getNativeBalance = async (userAddress) => {
  try {
    let balance = await web3.eth.getBalance(userAddress);

    return balance;
  } catch (error) {
    console.log(error);
  }
};
