import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Form from "./Form/Form";
import FormInput from "./Form/FormInput";
import FormInputRemove from "./Form/FormInputRemove";
import FormInputReceive from "./Form/FormInputReceive";
import { tokens } from "../blockchain/tokenList.json";
import {
  getPair,
  addLiquidity,
  addLiquidityETH,
  removeLiquidity,
  removeLiquidityETH,
  Approve,
  getQuote,
  checkAllowance,
  checkBalance,
  getNativeBalance,
} from "../blockchain/exchange";
import Moralis from "moralis";

export default function Liquidity({ walletType, userAddress, setPopupShow }) {
  const [removeA, setRemoveA] = useState(345);
  const [removeB, setRemoveB] = useState(3.49965);
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inBalance, setInBalance] = useState("");
  const [outBalance, setOutBalance] = useState("");
  const [addTab, setAddTab] = useState(true);
  const [exchangeText, setExchangeText] = useState("");
  const [allowance, setAllowance] = useState({
    tokenInAllow: false,
    tokenOutAllow: false,
    LPallowance: false,
  });
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    amountOutMin: "",
    LPbalance: "0",
    LPAddress: "",
    rateIn: "0",
    rateOut: "0",
    slippage: "0.5",

    tokenIn: {
      name: "BNB",
      selected: true,
      symbol: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
      logoURI:
        "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
    },
    tokenOut: {
      address: "0x55d398326f99059fF775485246999027B3197955",
      chainId: 56,
      selected: false,
      name: "Tether USD",
      symbol: "USDT",
      decimals: 18,
      logoURI:
        "https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x55d398326f99059fF775485246999027B3197955/logo.png",
    },
  });

  const setValue = async (num, side) => {
    if (side === "from") {
      const value = Moralis.Units.Token(num, trade.tokenIn.decimals);
      let amountOut = await quote(value, side);
      let amountOutMin = ((100 - trade.slippage) * amountOut) / 100;
      setTrade({ ...trade, amountIn: num, amountOut, amountOutMin });
    } else {
      const value = Moralis.Units.Token(num, trade.tokenOut.decimals);
      let amountIn = await quote(value, side);
      let amountOutMin = ((100 - trade.slippage) * num) / 100;
      setTrade({ ...trade, amountOut: num, amountIn, amountOutMin });
    }
  };

  const setTokens = (token, side) => {
    if (side === "from") {
      setTrade({ ...trade, tokenIn: token, amountIn: "0", amountOut: "0" });
    } else {
      setTrade({ ...trade, tokenOut: token, amountIn: "0", amountOut: "0" });
    }
  };

  // const quote = async (value, side) => {
  //   if (value <= 0) {
  //     return 0;
  //   }
  //   if (side === "from") {
  //     let { tokenAreserve, tokenBreserve } = await getPair(
  //       trade.tokenIn.address,
  //       trade.tokenOut.address,
  //       walletType
  //     );

  //     const rate =
  //       toWei(tokenAreserve, trade.tokenOut.decimals) /
  //       toWei(tokenBreserve, trade.tokenIn.decimals);

  //     let exchangeRate = value * rate;

  //     return (exchangeRate / 10 ** trade.tokenOut.decimals).toFixed(4);
  //   } else if (side === "to") {
  //     let { tokenAreserve, tokenBreserve } = await getPair(
  //       trade.tokenIn.address,
  //       trade.tokenOut.address,
  //       walletType
  //     );

  //     const rate =
  //       toWei(tokenAreserve, trade.tokenOut.decimals) /
  //       toWei(tokenBreserve, trade.tokenIn.decimals);

  //     let exchangeRate = value * rate;

  //     return exchangeRate.toFixed(4);
  //   }
  // };

  const quote = async (value, side) => {
    if (value <= 0) {
      return 0;
    }
    if (side === "from") {
      let result = await getQuote(
        value,
        [trade.tokenIn.address, trade.tokenOut.address],
        walletType,
        "amountOut"
      );

      return getNumberDecimals(
        result[result.length - 1] / 10 ** trade.tokenOut.decimals
      );
    } else if (side === "to") {
      let result = await getQuote(
        value,
        [trade.tokenIn.address, trade.tokenOut.address],
        walletType,
        "amountIn"
      );
      return getNumberDecimals(result[0] / 10 ** trade.tokenIn.decimals);
    }
  };

  const getNumberDecimals = (num) => {
    let length = Math.floor(num).toString().length;
    if (length > 4) {
      return Number(num).toFixed(0);
    } else {
      return Number(num).toFixed(6);
    }
  };

  const toWei = (num, decimals) => {
    return Moralis.Units.Token(num, decimals);
  };

  const getExchangeRate = async () => {
    let { pairAddress, tokenAreserve, tokenBreserve, supply } = await getPair(
      trade.tokenIn.address,
      trade.tokenOut.address,
      walletType
    );

    if (pairAddress && userAddress) {
      let LPbalance = await checkBalance(walletType, userAddress, pairAddress);

      let eth = Moralis.Units.FromWei(LPbalance, "18");

      setTrade({
        ...trade,
        LPbalance: eth || 0,
        rateIn: tokenAreserve / supply,
        rateOut: tokenBreserve / supply,
        LPAddress: pairAddress,
      });
    }

    const rate =
      toWei(tokenAreserve, trade.tokenOut.decimals) /
      toWei(tokenBreserve, trade.tokenIn.decimals);

    const exchangeRate = `${rate.toFixed(10)} ${trade.tokenIn.symbol} per ${
      trade.tokenOut.symbol
    }`;
    setExchangeText(exchangeRate);
  };

  const handleAllow = async (addressToApprove) => {
    let receipt = await Approve(walletType, userAddress, addressToApprove);

    if (receipt) {
      console.log(receipt);
      checkUserAllowance();
    }
  };

  const checkUserAllowance = async () => {
    if (userAddress) {
      let LPAllowance = false;
      let tokenInAllow = 0;
      let tokenOutAllow = 0;

      if (trade.tokenIn.name === "BNB") {
        tokenInAllow = 1;
      } else {
        tokenInAllow = await checkAllowance(
          walletType,
          userAddress,
          trade.tokenIn.address
        );
      }
      if (trade.tokenOut.name === "BNB") {
        tokenOutAllow = 1;
      } else {
        tokenOutAllow = await checkAllowance(
          walletType,
          userAddress,
          trade.tokenOut.address
        );
      }

      let { pairAddress } = await getPair(
        trade.tokenIn.address,
        trade.tokenOut.address,
        walletType
      );

      if (pairAddress) {
        let allowance = await checkAllowance(
          walletType,
          userAddress,
          pairAddress
        );
        LPAllowance = allowance > 0;
      }

      setAllowance({
        tokenInAllow: tokenInAllow > 0,
        tokenOutAllow: tokenOutAllow > 0,
        LPAllowance,
      });
    }
  };

  const handleAdd = async () => {
    setIsLoading(true);
    let amountIn = Moralis.Units.Token(trade.amountIn, trade.tokenIn.decimals);
    let amountOut = Moralis.Units.Token(
      trade.amountOut,
      trade.tokenOut.decimals
    );

    let receipt;

    if (trade.tokenIn.name === "BNB" || trade.tokenOut.name === "BNB") {
      let tokenA;
      let amountADesired;
      let amountBDesired;
      if (trade.tokenIn.name === "BNB") {
        tokenA = trade.tokenOut.address;
        amountADesired = amountOut;
        amountBDesired = amountIn;
      } else if (trade.tokenOut.name === "BNB") {
        tokenA = trade.tokenIn.address;
        amountADesired = amountIn;
        amountBDesired = amountOut;
      }

      receipt = await addLiquidityETH(
        tokenA,
        amountADesired,
        amountBDesired,
        userAddress,
        walletType
      );
    } else {
      receipt = await addLiquidity(
        trade.tokenIn.address,
        trade.tokenOut.address,
        amountIn,
        amountOut,
        userAddress,
        walletType
      );
    }

    if (receipt) {
      console.log(receipt);
      getUserBalance();
      getExchangeRate();
    }
    setIsLoading(false);
  };

  const handleRemove = async () => {
    setIsLoading(true);
    let liquidity = Moralis.Units.Token(percentage, "18");

    let receipt;

    if (trade.tokenIn.name === "BNB" || trade.tokenOut.name === "BNB") {
      let tokenA;

      if (trade.tokenIn.name === "BNB") {
        tokenA = trade.tokenOut.address;
      } else if (trade.tokenOut.name === "BNB") {
        tokenA = trade.tokenIn.address;
      }

      receipt = await removeLiquidityETH(
        tokenA,
        liquidity - 100,
        userAddress,
        walletType
      );
    } else {
      receipt = await removeLiquidity(
        trade.tokenIn.address,
        trade.tokenOut.address,
        liquidity - 100,
        userAddress,
        walletType
      );
    }

    if (receipt) {
      getUserBalance();
      getExchangeRate();
    }
    setIsLoading(false);
  };

  const getUserBalance = async () => {
    if (userAddress) {
      let inBalance;
      let outBalance;
      if (trade.tokenIn.name === "BNB") {
        inBalance = await getNativeBalance(userAddress);
      } else {
        inBalance = await checkBalance(
          walletType,
          userAddress,
          trade.tokenIn.address
        );
      }
      if (trade.tokenOut.name === "BNB") {
        outBalance = await getNativeBalance(userAddress);
      } else {
        outBalance = await checkBalance(
          walletType,
          userAddress,
          trade.tokenOut.address
        );
      }

      setInBalance(
        getNumberDecimals(
          Moralis.Units.FromWei(inBalance, trade.tokenIn.decimals)
        )
      );

      setOutBalance(
        getNumberDecimals(
          Moralis.Units.FromWei(outBalance, trade.tokenOut.decimals)
        )
      );
    }
  };

  let getRemoveValues = () => {
    if (percentage > trade.LPbalance) {
      setPercentage(trade.LPbalance);
    }
    setRemoveA(percentage * trade.rateIn || "0");
    setRemoveB(percentage * trade.rateOut || "0");
  };

  let setRemoveMax = () => {
    setPercentage(trade.LPbalance);
  };

  useEffect(() => {
    getRemoveValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  useEffect(() => {
    getUserBalance();
    getExchangeRate();
    checkUserAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade.tokenIn, trade.tokenOut, userAddress]);

  return (
    <Form
      trade={trade}
      setTrade={setTrade}
      className="form--liquidity"
      title="Liquidity"
    >
      <div className="form__tip">
        <strong>Tip:</strong> When you add liquidity, you will receive pool
        tokens representing your position. These tokens automatically earn fees
        proportional to your share of the pool, and can be redeemed at any time.
      </div>
      <div className="form__tab-buttons">
        <button
          className={"form__tab-button" + (addTab ? " active" : "")}
          onClick={() => setAddTab(true)}
        >
          Add
        </button>
        <button
          className={"form__tab-button" + (addTab ? "" : " active")}
          onClick={() => setAddTab(false)}
        >
          Remove
        </button>
      </div>
      {addTab ? (
        <FormInput
          tokens={tokens}
          value={trade.amountIn}
          setValue={setValue}
          selected={trade.tokenIn}
          setTokens={setTokens}
          title=""
          side="from"
          balance={inBalance}
        />
      ) : (
        <FormInputRemove
          LPbalance={trade.LPbalance}
          value={percentage}
          setValue={setPercentage}
          setRemoveMax={setRemoveMax}
        />
      )}

      <button className="button button--round button--plus form__round">
        <span className="plus button__icon"></span>
      </button>
      {addTab ? (
        <FormInput
          tokens={tokens}
          value={trade.amountOut}
          setValue={setValue}
          selected={trade.tokenOut}
          setTokens={setTokens}
          title=""
          side="to"
          balance={outBalance}
        />
      ) : (
        <FormInputReceive
          selected1={trade.tokenIn}
          selected2={trade.tokenOut}
          tokens={tokens}
          value1={removeA}
          value2={removeB}
          setTokens={setTokens}
          setValue={setValue}
        />
      )}

      <div className="form__row">
        <p className="form__text">Current Rate</p>
        <span className="form__text form__text--main">{exchangeText}</span>
      </div>
      {userAddress === "" ? (
        <button
          onClick={setPopupShow}
          className="button button--red button--form"
        >
          Connect Wallet
        </button>
      ) : addTab && allowance.tokenInAllow && allowance.tokenOutAllow ? (
        <button
          disabled={trade.amountIn > inBalance || trade.amountOut > outBalance}
          onClick={handleAdd}
          className="button button--red button--form"
        >
          {trade.amountIn > inBalance
            ? `insufficient ${trade.tokenIn.symbol} funds`
            : trade.amountOut > outBalance
            ? `insufficient ${trade.tokenOut.symbol} funds`
            : "Add Liquidity"}
        </button>
      ) : addTab && !allowance.tokenInAllow ? (
        <button
          onClick={() => handleAllow(trade.tokenIn.address)}
          className="button button--red button--form"
        >
          Allow {trade.tokenIn.symbol}
        </button>
      ) : addTab && !allowance.tokenOutAllow ? (
        <button
          onClick={() => handleAllow(trade.tokenOut.address)}
          className="button button--red button--form"
        >
          Allow {trade.tokenOut.symbol}
        </button>
      ) : allowance.LPAllowance ? (
        <button
          disabled={isLoading}
          onClick={handleRemove}
          className="button button--red button--form"
        >
          Remove Liquidity
        </button>
      ) : (
        <button
          onClick={() => handleAllow(trade.LPAddress)}
          className="button button--red button--form"
        >
          Approve
        </button>
      )}
      <div className="form__tip form__tip--mt">
        ⭐️ By adding liquidity you'll earn a percentage of all trades on this
        pair proportional to your share of the pool. Fees are added to the pool,
        accrue in real time and can be claimed by withdrawing your liquidity.{" "}
        <Link to="/">
          <strong>Learn More</strong>
        </Link>
      </div>
    </Form>
  );
}
