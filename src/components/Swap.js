import { useState, useEffect } from "react";
import Form from "./Form/Form";
import FormInput from "./Form/FormInput";
import Info from "./../icons/Info";
import Arrows from "./../icons/Arrows";
import Moralis from "moralis";
import {
  swap,
  getPair,
  getQuote,
  Approve,
  checkAllowance,
  checkBalance,
  getNativeBalance,
} from "../blockchain/exchange";
import Popup from "reactjs-popup";
import { tokens } from "../blockchain/tokenList.json";

export default function Swap({ walletType, userAddress, setPopupShow }) {
  const [isLoading, setIsLoading] = useState(false);
  const [inBalance, setInBalance] = useState("");
  const [outBalance, setOutBalance] = useState("");
  const [enoughAllowance, setEnoughAllowance] = useState(true);
  const [exchangeText, setExchangeText] = useState("");
  const [impact, setImpact] = useState(0);
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    amountOutMin: "",
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
      const value = toWei(num, trade.tokenIn.decimals);
      let amountOut = await quote(value, side);
      let amountOutMin = ((100 - trade.slippage) * amountOut) / 100;
      setTrade({
        ...trade,
        amountIn: num,
        amountOut: getNumberDecimals(amountOut),
        amountOutMin,
      });
    } else {
      const value = toWei(num, trade.tokenOut.decimals);
      let amountIn = await quote(value, side);
      let amountOutMin = ((100 - trade.slippage) * num) / 100;
      setTrade({
        ...trade,
        amountOut: num,
        amountIn: getNumberDecimals(amountIn),
        amountOutMin,
      });
    }
  };

  const changeSides = async () => {
    let tokenOut = trade.tokenIn;
    let tokenIn = trade.tokenOut;
    setTrade({
      ...trade,
      amountIn: "",
      amountOut: "",
      amountOutMin: "",
      tokenIn,
      tokenOut,
    });
  };

  const getNumberDecimals = (num) => {
    let length = Math.floor(num).toString().length;
    if (length > 4) {
      return Number(num).toFixed(0);
    } else {
      return Number(num).toFixed(6);
    }
  };

  //amount, path, walletType, quoteType
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

      return result[result.length - 1] / 10 ** trade.tokenOut.decimals;
    } else if (side === "to") {
      let result = await getQuote(
        value,
        [trade.tokenIn.address, trade.tokenOut.address],
        walletType,
        "amountIn"
      );
      return result[0] / 10 ** trade.tokenIn.decimals;
    }
  };

  const checkTokenAllowance = async () => {
    if (trade.tokenIn.name === "BNB") {
      setEnoughAllowance(true);
    } else {
      let allowance = await checkAllowance(
        walletType,
        userAddress,
        trade.tokenIn.address
      );

      if (allowance < 1) {
        setEnoughAllowance(false);
      } else {
        setEnoughAllowance(true);
      }
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    let receipt = await Approve(walletType, userAddress, trade.tokenIn.address);
    if (receipt) {
      checkTokenAllowance();
    }
    setIsLoading(false);
  };

  const setTokens = (token, side) => {
    if (side === "from") {
      setTrade({ ...trade, tokenIn: token, amountIn: "0", amountOut: "0" });
    } else {
      setTrade({ ...trade, tokenOut: token, amountIn: "0", amountOut: "0" });
    }
  };

  const initSwap = async () => {
    setIsLoading(true);
    let amountIn = toWei(trade.amountIn, trade.tokenIn.decimals);
    let amountOutMin = toWei(trade.amountOutMin, trade.tokenOut.decimals);

    let exchangeType;
    if (trade.tokenIn.name === "BNB") {
      exchangeType = "ETHtoToken";
    } else if (trade.tokenOut.name === "BNB") {
      exchangeType = "tokenToEth";
    } else {
      exchangeType = "tokenToToken";
    }

    let receipt = await swap(
      amountIn,
      amountOutMin,
      [trade.tokenIn.address, trade.tokenOut.address],
      userAddress,
      Date.now() + 1000 * 60 * 10,
      walletType,
      exchangeType
    );

    if (receipt) {
      console.log(receipt);
      getUserBalance();
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

      setInBalance(getNumberDecimals(inBalance / 10 ** trade.tokenIn.decimals));
      setOutBalance(
        getNumberDecimals(
          Moralis.Units.FromWei(outBalance, trade.tokenOut.decimals)
        )
      );
    }
  };

  const getExchangeRate = async () => {
    let result = await getPair(
      trade.tokenIn.address,
      trade.tokenOut.address,
      walletType
    );

    if (result) {
      let { tokenAreserve, tokenBreserve } = result;
      const rate =
        toWei(tokenAreserve, trade.tokenOut.decimals) /
        toWei(tokenBreserve, trade.tokenIn.decimals);

      let amountIn = toWei(trade.amountIn, trade.tokenIn.decimals);

      let pairConstant = tokenAreserve * tokenBreserve;
      let inAfterSwap = Number(tokenAreserve) + Number(amountIn);
      let outAfterSwap = pairConstant / inAfterSwap;
      let newRate = inAfterSwap / outAfterSwap;
      let amountWithNewRate =
        (trade.amountIn / newRate) *
        10 ** (trade.tokenIn.decimals - trade.tokenOut.decimals);

      let impact =
        ((trade.amountOut - amountWithNewRate) * 100) / trade.amountOut;

      if (impact < 0 || !impact) {
        impact = 0;
      }

      const exchangeRate = `${rate.toFixed(10)} ${trade.tokenIn.symbol} per ${
        trade.tokenOut.symbol
      }`;
      setExchangeText(exchangeRate);
      setImpact(impact.toFixed(2));
    } else {
      const value = toWei("1", trade.tokenOut.decimals);
      let rate = await quote(value, "to");
      const exchangeRate = `${Number(rate).toFixed(10)} ${
        trade.tokenIn.symbol
      } per ${trade.tokenOut.symbol}`;
      setExchangeText(exchangeRate);
    }
  };

  const toWei = (num, decimals) => {
    return Moralis.Units.Token(num, decimals) || num ** 10 * decimals;
  };

  useEffect(() => {
    checkTokenAllowance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade.tokenIn]);

  useEffect(() => {
    getUserBalance();
    getExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade.tokenIn, trade.tokenOut, userAddress]);

  useEffect(() => {
    getExchangeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trade.amountIn]);

  return (
    <Form trade={trade} setTrade={setTrade} className="form--swap" title="Swap">
      <>
        <p className="form__text form__text--mb">Trade tokens in an instant</p>
        <FormInput
          tokens={tokens}
          value={trade.amountIn}
          setValue={setValue}
          selected={trade.tokenIn}
          setTokens={setTokens}
          title="From"
          side="from"
          balance={inBalance}
        />
        <button
          className="button button--round form__round"
          onClick={changeSides}
        >
          <Arrows className="button__icon" />
        </button>
        <FormInput
          tokens={tokens}
          value={trade.amountOut}
          setValue={setValue}
          selected={trade.tokenOut}
          setTokens={setTokens}
          title="To (estimated)"
          side="to"
          balance={outBalance}
        />
        <div className="form__row">
          <p className="form__text">Price</p>
          <span className="form__text form__text--main">{exchangeText}</span>
        </div>
        {userAddress === "" ? (
          <button
            onClick={setPopupShow}
            className="button button--red button--form"
          >
            Connect Wallet
          </button>
        ) : isLoading ? (
          <button disabled={true} className="button button--red button--form">
            Swapping...
          </button>
        ) : (
          <button
            disabled={trade.amountIn > inBalance}
            onClick={
              !enoughAllowance ? () => handleApprove() : () => initSwap()
            }
            className="button button--red button--form"
          >
            {!enoughAllowance
              ? "Approve Token"
              : trade.amountIn <= inBalance
              ? "Swap"
              : "Insufficient Funds"}
          </button>
        )}
        <div className="form__info">
          <ul className="form__info-list">
            <li className="form__info-item">
              <span className="form__text">
                <p>Minimum received</p>
                <span>
                  <Popup
                    // key={`tp-${item.id}`}
                    trigger={
                      <button
                        type="button"
                        style={{ padding: "0px 0px 0px 0px" }}
                      >
                        <Info className="form__info-icon" />
                      </button>
                    }
                    position={"top left"}
                    on={["hover", "focus"]}
                    arrow={false}
                  >
                    <div className="info-popup">
                      Your transaction will revert if there is a large,
                      unfavorable price movement before it is confirmed.
                    </div>
                  </Popup>
                </span>
              </span>
              <span className="form__text form__text--main">
                {trade.amountOutMin || 0} {trade.tokenOut.symbol}
              </span>
            </li>
            <li className="form__info-item">
              <span className="form__text">
                <p>Price impact</p>

                <span>
                  <Popup
                    // key={`tp-${item.id}`}
                    trigger={
                      <button
                        type="button"
                        style={{ padding: "0px 0px 0px 0px" }}
                      >
                        <Info className="form__info-icon" />
                      </button>
                    }
                    position={"top left"}
                    on={["hover", "focus"]}
                    arrow={false}
                  >
                    <div className="info-popup">
                      The difference between the market price and estimated
                      price due to trade size.
                    </div>
                  </Popup>
                </span>
              </span>
              <span className="form__text form__text--main">{impact}%</span>
            </li>
            <li className="form__info-item">
              <span className="form__text">
                <p>Trade fee</p>
                <span>
                  <Popup
                    // key={`tp-${item.id}`}
                    trigger={
                      <button
                        type="button"
                        style={{ padding: "0px 0px 0px 0px" }}
                      >
                        <Info className="form__info-icon" />
                      </button>
                    }
                    position={"top left"}
                    on={["hover", "focus"]}
                    arrow={false}
                  >
                    <div className="info-popup">
                      For each trade a 0.25% fee is paid - 0.17% to LP token
                      holders - 0.03% to the Treasury - 0.05% towards CAKE
                      buyback and burn
                    </div>
                  </Popup>
                </span>
              </span>
              <span className="form__text form__text--main">
                {trade.amountIn * 0.0025} {trade.tokenIn.symbol}
              </span>
            </li>
            {/* <li className="form__info-item">
              <span className="form__text">
                <p>Return fee</p>
                <Info className="form__info-icon" />
              </span>
              <span className="form__text form__text--main">
                135.46400 ETH ~ 167.103 $
              </span>
            </li> */}
          </ul>
        </div>
      </>
    </Form>
  );
}

// import { useState, useEffect } from "react";
// import Form from "./Form/Form";
// import FormInput from "./Form/FormInput";
// import Info from "./../icons/Info";
// import Arrows from "./../icons/Arrows";
// import Moralis from "moralis";
// import { swap, getPair, getQuote, Approve, checkAllowance, checkBalance, getNativeBalance } from "../blockchain/exchange";
// import Popup from "reactjs-popup";
// import { tokens } from "../blockchain/tokenList.json";

// export default function Swap({ walletType, userAddress, setPopupShow }) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [inBalance, setInBalance] = useState("");
//   const [outBalance, setOutBalance] = useState("");
//   const [enoughAllowance, setEnoughAllowance] = useState(true);
//   const [exchangeText, setExchangeText] = useState("");
//   const [impact, setImpact] = useState(0);
//   const [trade, setTrade] = useState({
//     amountIn: "",
//     amountOut: "",
//     amountOutMin: "",
//     slippage: "0.5",
//     tokenIn: {
//       address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
//       chainId: 56,
//       selected: false,
//       name: "BNB",
//       symbol: "BNB",
//       decimals: 18,
//       logoURI: "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
//     },
//     tokenOut: {
//       name: "Sensei Shib",
//       selected: true,
//       symbol: "SENSEI",
//       address: "0xC58B6593B37D825779330Cd58B1f250e9eD7E10A",
//       decimals: 9,
//       logoURI: "images/logo.png",
//     },
//   });

//   const setValue = async (num, side) => {
//     if (side === "from") {
//       const value = Moralis.Units.Token(num, trade.tokenIn.decimals);
//       let amountOut = await quote(value, side);
//       let amountOutMin = ((100 - trade.slippage) * amountOut) / 100;
//       setTrade({ ...trade, amountIn: num, amountOut, amountOutMin });
//     } else {
//       const value = Moralis.Units.Token(num, trade.tokenIn.decimals);
//       let amountIn = await quote(value, side);
//       let amountOutMin = ((100 - trade.slippage) * num) / 100;
//       setTrade({ ...trade, amountOut: num, amountIn, amountOutMin });
//     }
//   };

//   const changeSides = async () => {
//     let tokenOut = trade.tokenIn;
//     let tokenIn = trade.tokenOut;
//     setTrade({
//       ...trade,
//       amountIn: "",
//       amountOut: "",
//       amountOutMin: "",
//       tokenIn,
//       tokenOut,
//     });
//   };

//   //amount, path, walletType, quoteType
//   const quote = async (value, side) => {
//     if (value <= 0) {
//       return 0;
//     }
//     if (side === "from") {
//       let result = await getQuote(value, [trade.tokenIn.address, trade.tokenOut.address], walletType, "amountOut");

//       return (result[result.length - 1] / 10 ** trade.tokenIn.decimals).toFixed(4);
//     } else if (side === "to") {
//       let result = await getQuote(value, [trade.tokenIn.address, trade.tokenOut.address], walletType, "amountIn");
//       return (result[0] / 10 ** trade.tokenOut.decimals).toFixed(4);
//     }
//   };

//   const checkTokenAllowance = async () => {
//     if (trade.tokenIn.name === "BNB") {
//       setEnoughAllowance(true);
//     } else {
//       let allowance = await checkAllowance(walletType, userAddress, trade.tokenIn.address);

//       if (allowance < 1) {
//         setEnoughAllowance(false);
//       } else {
//         setEnoughAllowance(true);
//       }
//     }
//   };

//   const handleApprove = async () => {
//     setIsLoading(true);
//     let receipt = await Approve(walletType, userAddress, trade.tokenIn.address);
//     if (receipt) {
//       checkTokenAllowance();
//     }
//     setIsLoading(false);
//   };

//   const setTokens = (token, side) => {
//     if (side === "from") {
//       setTrade({ ...trade, tokenIn: token, amountIn: "0", amountOut: "0" });
//     } else {
//       setTrade({ ...trade, tokenOut: token, amountIn: "0", amountOut: "0" });
//     }
//   };

//   const initSwap = async () => {
//     setIsLoading(true);
//     let amountIn = Moralis.Units.Token(trade.amountIn, trade.tokenIn.decimals);
//     let amountOutMin = Moralis.Units.Token(trade.amountOutMin, trade.tokenOut.decimals);
//     let exchangeType;
//     if (trade.tokenIn.name === "BNB") {
//       exchangeType = "ETHtoToken";
//     } else if (trade.tokenOut.name === "BNB") {
//       exchangeType = "tokenToEth";
//     } else {
//       exchangeType = "tokenToToken";
//     }

//     let receipt = await swap(
//       amountIn,
//       amountOutMin,
//       [trade.tokenIn.address, trade.tokenOut.address],
//       userAddress,
//       Date.now() + 1000 * 60 * 10,
//       walletType,
//       exchangeType
//     );

//     if (receipt) {
//       console.log(receipt);
//       getUserBalance();
//     }
//     setIsLoading(false);
//   };

//   const getUserBalance = async () => {
//     if (userAddress) {
//       let inBalance;
//       let outBalance;
//       if (trade.tokenIn.name === "BNB") {
//         inBalance = await getNativeBalance(userAddress);
//       } else {
//         inBalance = await checkBalance(walletType, userAddress, trade.tokenIn.address);
//       }
//       if (trade.tokenOut.name === "BNB") {
//         outBalance = await getNativeBalance(userAddress);
//       } else {
//         outBalance = await checkBalance(walletType, userAddress, trade.tokenOut.address);
//       }

//       setInBalance(Moralis.Units.FromWei(inBalance, trade.tokenOut.decimals).toFixed(4));
//       setOutBalance(Moralis.Units.FromWei(outBalance, trade.tokenIn.decimals).toFixed(4));
//     }
//   };

//   const getExchangeRate = async () => {
//     let { tokenAreserve, tokenBreserve } = await getPair(trade.tokenIn.address, trade.tokenOut.address, walletType);

//     const rate = tokenAreserve / tokenBreserve;

//     let amountIn = Moralis.Units.Token(trade.amountIn, trade.tokenIn.decimals);

//     let pairConstant = tokenAreserve * tokenBreserve;
//     let inAfterSwap = Number(tokenAreserve) + Number(amountIn);
//     let outAfterSwap = pairConstant / inAfterSwap;
//     let newRate = inAfterSwap / outAfterSwap;
//     let amountWithNewRate = trade.amountIn / newRate;

//     let impact = ((trade.amountOut - amountWithNewRate) * 100) / trade.amountOut;

//     if (impact < 0 || !impact) {
//       impact = 0;
//     }

//     const exchangeRate = `${rate.toFixed(6)} ${trade.tokenIn.symbol} per ${trade.tokenOut.symbol}`;
//     setExchangeText(exchangeRate);
//     setImpact(impact.toFixed(2));
//   };

//   useEffect(() => {
//     checkTokenAllowance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [trade.tokenIn]);

//   useEffect(() => {
//     getUserBalance();
//     getExchangeRate();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [trade.tokenIn, trade.tokenOut, userAddress]);

//   useEffect(() => {
//     getExchangeRate();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [trade.amountIn]);

//   return (
//     <Form trade={trade} setTrade={setTrade} className="form--swap" title="Swap">
//       <>
//         <p className="form__text form__text--mb">Trade tokens in an instant</p>
//         <FormInput
//           tokens={tokens}
//           value={trade.amountIn}
//           setValue={setValue}
//           selected={trade.tokenIn}
//           setTokens={setTokens}
//           title="From"
//           side="from"
//           balance={inBalance}
//         />
//         <button className="button button--round form__round" onClick={changeSides}>
//           <Arrows className="button__icon" />
//         </button>
//         <FormInput
//           tokens={tokens}
//           value={trade.amountOut}
//           setValue={setValue}
//           selected={trade.tokenOut}
//           setTokens={setTokens}
//           title="To (estimated)"
//           side="to"
//           balance={outBalance}
//         />
//         <div className="form__row">
//           <p className="form__text">Price</p>
//           <span className="form__text form__text--main">{exchangeText}</span>
//         </div>
//         {userAddress === "" ? (
//           <button onClick={setPopupShow} className="button button--red button--form">
//             Connect Wallet
//           </button>
//         ) : isLoading ? (
//           <button disabled={true} className="button button--red button--form">
//             Swapping...
//           </button>
//         ) : (
//           <button
//             disabled={trade.amountIn >= inBalance}
//             onClick={!enoughAllowance ? () => handleApprove() : () => initSwap()}
//             className="button button--red button--form"
//           >
//             {!enoughAllowance ? "Approve Token" : trade.amountIn <= inBalance ? "Swap" : "Insufficient Funds"}
//           </button>
//         )}
//         <div className="form__info">
//           <ul className="form__info-list">
//             <li className="form__info-item">
//               <span className="form__text">
//                 <p>Minimum received</p>
//                 <span>
//                   <Popup
//                     // key={`tp-${item.id}`}
//                     trigger={
//                       <button type="button" style={{ padding: "0px 0px 0px 0px" }} className="button">
//                         <Info className="form__info-icon" />
//                       </button>
//                     }
//                     position={"top left"}
//                     on={["hover", "focus"]}
//                     arrow={false}
//                   >
//                     <div className="info-popup">Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.</div>
//                   </Popup>
//                 </span>
//               </span>
//               <span className="form__text form__text--main">
//                 {trade.amountOutMin || 0} {trade.tokenOut.symbol}
//               </span>
//             </li>
//             <li className="form__info-item">
//               <span className="form__text">
//                 <p>Price impact</p>

//                 <span>
//                   <Popup
//                     // key={`tp-${item.id}`}
//                     trigger={
//                       <button type="button" style={{ padding: "0px 0px 0px 0px" }} className="button">
//                         <Info className="form__info-icon" />
//                       </button>
//                     }
//                     position={"top left"}
//                     on={["hover", "focus"]}
//                     arrow={false}
//                   >
//                     <div className="info-popup">The difference between the market price and estimated price due to trade size.</div>
//                   </Popup>
//                 </span>
//               </span>
//               <span className="form__text form__text--main">{impact}%</span>
//             </li>
//             <li className="form__info-item">
//               <span className="form__text">
//                 <p>Trade fee</p>
//                 <span>
//                   <Popup
//                     // key={`tp-${item.id}`}
//                     trigger={
//                       <button type="button" style={{ padding: "0px 0px 0px 0px" }} className="button">
//                         <Info className="form__info-icon" />
//                       </button>
//                     }
//                     position={"top left"}
//                     on={["hover", "focus"]}
//                     arrow={false}
//                   >
//                     <div className="info-popup">
//                       For each trade a 0.25% fee is paid - 0.17% to LP token holders - 0.03% to the Treasury - 0.05% towards CAKE buyback and burn
//                     </div>
//                   </Popup>
//                 </span>
//               </span>
//               <span className="form__text form__text--main">
//                 {trade.amountIn * 0.0025} {trade.tokenIn.symbol}
//               </span>
//             </li>
//             {/* <li className="form__info-item">
//               <span className="form__text">
//                 <p>Return fee</p>
//                 <Info className="form__info-icon" />
//               </span>
//               <span className="form__text form__text--main">
//                 135.46400 ETH ~ 167.103 $
//               </span>
//             </li> */}
//           </ul>
//         </div>
//       </>
//     </Form>
//   );
// }
