import web3 from "../web3";
import ContratInterface, {
  contractAddress,
} from "../interface/routertInterface";
import tokenInterface from "../interface/tokenInterface";
import factoryInterface from "../interface/factoryInterface";
import allocationInterface from "../interface/allocationInterface";

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

    let receipt = await myContract.methods
      .approve(
        contractAddress,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )
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

// liquidity functions

export const getPair = async (tokenA, tokenB, walletType) => {
  try {
    let myContract = await factoryInterface(walletType);
    let pairAddress = await myContract.methods.getPair(tokenA, tokenB).call();
    let pairContract = await tokenInterface(walletType, pairAddress);
    // tokenA = await pairContract.methods.token0().call();
    // tokenB = await pairContract.methods.token1().call();
    let tokenAcontract = await tokenInterface(walletType, tokenA);
    let tokenBcontract = await tokenInterface(walletType, tokenB);
    let supply = await pairContract.methods.totalSupply().call();
    let tokenAreserve = await tokenAcontract.methods
      .balanceOf(pairAddress)
      .call();
    let tokenBreserve = await tokenBcontract.methods
      .balanceOf(pairAddress)
      .call();

    return { pairAddress, tokenAreserve, tokenBreserve, supply };
  } catch (error) {
    console.log("no pair founded");
  }
};

export const addLiquidity = async (
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  userAddress,
  walletType
) => {
  let myContract = await ContratInterface(walletType);
  let receipt = myContract.methods
    .addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      "0",
      "0",
      userAddress,
      Date.now() + 1000 * 60 * 10
    )
    .send({ from: userAddress });

  console.log(receipt);
};

export const addLiquidityETH = async (
  tokenA,
  amountADesired,
  amountBDesired,
  userAddress,
  walletType
) => {
  let myContract = await ContratInterface(walletType);

  let receipt = myContract.methods
    .addLiquidityETH(
      tokenA,
      amountADesired,
      "0",
      "0",
      userAddress,
      Date.now() + 1000 * 60 * 10
    )
    .send({ from: userAddress, value: amountBDesired });

  console.log(receipt);
};

export const removeLiquidity = async (
  tokenA,
  tokenB,
  liquidity,
  userAddress,
  walletType
) => {
  let myContract = await ContratInterface(walletType);

  let receipt = await myContract.methods
    .removeLiquidity(
      tokenA,
      tokenB,
      liquidity.toString(),
      "0",
      "0",
      userAddress,
      Date.now() + 1000 * 60 * 10
    )
    .send({ from: userAddress });

  console.log(receipt);
};

export const removeLiquidityETH = async (
  tokenA,
  liquidity,
  userAddress,
  walletType
) => {
  let myContract = await ContratInterface(walletType);

  // console.log("remove liquidity", {
  //   tokenA,
  //   liquidity: liquidity,
  //   true: "76064724769547085",
  //   userAddress,
  // });
  let receipt = await myContract.methods
    .removeLiquidityETH(
      tokenA,
      liquidity.toString(),
      "0",
      "0",
      userAddress,
      Date.now() + 1000 * 60 * 10
    )
    .send({ from: userAddress });

  console.log(receipt);
};

export const checkAllocationStatus = async (userAddress, walletType) => {
  try {
    let myContract = await allocationInterface(walletType);

    let userAllocation = await myContract.methods
      .userAllocation(userAddress)
      .call();
    let startTime = await myContract.methods.startTime().call();
    let stages = [];
    for (let i = 0; i < 4; i++) {
      stages[i] = await myContract.methods
        .isStageClaimed(userAddress, i)
        .call();
    }

    return { stages, userAllocation, startTime };
  } catch (error) {
    console.log(error);
  }
};

export const claim = async (stage, userAddress, walletType) => {
  try {
    let myContract = await allocationInterface(walletType);

    let receipt = await myContract.methods
      .claim(stage)
      .send({ from: userAddress, gas: 350000 });

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error);
    window.alert(`${error}`);
    window.alert(`${error.message}`);
    window.alert(`${error.data?.message}`);
  }
};

// isStageClaimed
// claim
// userAllocation
