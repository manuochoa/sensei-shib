import Gear from "../../icons/Gear";
import History from "./../../icons/History";
import Popup from "reactjs-popup";
import Info from "../../icons/Info";
import NumberFormat from "react-number-format";
import { useState } from "react";

export default function Form({ trade, setTrade, className, title, children }) {
  const [minutes, setMinutes] = useState("");
  const [dropdownShowed, setDropdownShowed] = useState(false);
  const [selected, setSelected] = useState(2);

  const setSlippage = (num) => {
    let amountOutMin = ((100 - num) * trade.amountOut) / 100;
    setTrade({ ...trade, slippage: num, amountOutMin });
  };

  return (
    <div className={"form container " + (className || "")}>
      <div className="form__wrapper">
        <div className="form__top">
          <h1 className="form__title">{title}</h1>
          <div className="form__top-button-wrapper">
            <button
              className={"form__top-button" + (dropdownShowed ? " active" : "")}
              onClick={() => setDropdownShowed((state) => !state)}
            >
              <Gear className="form__top-button-icon" />
            </button>
            <div
              className={
                "dropdown dropdown--settings" +
                (dropdownShowed ? " opened" : "")
              }
            >
              <h3 className="dropdown__title">Transaction Settings</h3>
              <div className="dropdown__scrollwrapper scrollwrapper">
                <div className="dropdown__label dropdown__label--mt">
                  <span>Slippage tolerance</span>
                  <Popup
                    // key={`tp-${item.id}`}
                    trigger={
                      <button
                        type="button"
                        style={{ padding: "0px 0px 0px 0px" }}
                        className="button"
                      >
                        <Info className="form__info-icon" />
                      </button>
                    }
                    position={"top left"}
                    on={["hover", "focus"]}
                    arrow={false}
                  >
                    <div className="info-popup">
                      Setting a high slippage tolerance can help transactions
                      succeed, but you may not get such a good price. Use with
                      caution.
                    </div>
                  </Popup>
                </div>
                <div className="dropdown__variants">
                  <ul className="dropdown__variants-list">
                    <li className="dropdown__variants-item">
                      <button
                        onClick={(e) => {
                          setSlippage(0.1);
                          setSelected(1);
                        }}
                        className={
                          selected === 1
                            ? "dropdown__button active"
                            : "dropdown__button"
                        }
                      >
                        0.1%
                      </button>
                    </li>
                    <li className="dropdown__variants-item">
                      <button
                        onClick={(e) => {
                          setSlippage(0.5);
                          setSelected(2);
                        }}
                        className={
                          selected === 2
                            ? "dropdown__button active"
                            : "dropdown__button"
                        }
                      >
                        0.5%
                      </button>
                    </li>
                    <li className="dropdown__variants-item">
                      <button
                        onClick={(e) => {
                          setSlippage(1);
                          setSelected(3);
                        }}
                        className={
                          selected === 3
                            ? "dropdown__button active"
                            : "dropdown__button"
                        }
                      >
                        1%
                      </button>
                    </li>
                  </ul>
                  <div className="input-wrapper input-wrapper--percentage">
                    <NumberFormat
                      // value={trade.slippage}
                      className="input-wrapper__input input dropdown__input"
                      placeholder="0.0001"
                      onChange={(e) => {
                        setSelected(0);
                        setSlippage(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="dropdown__label dropdown__label--mt">
                  <span>Transaction deadline</span>
                  <Popup
                    // key={`tp-${item.id}`}
                    trigger={
                      <button
                        type="button"
                        style={{ padding: "0px 0px 0px 0px" }}
                        className="button"
                      >
                        <Info className="form__info-icon" />
                      </button>
                    }
                    position={"top left"}
                    on={["hover", "focus"]}
                    arrow={false}
                  >
                    <div className="info-popup">
                      Your transaction will revert if it is left confirming for
                      longer than this time.
                    </div>
                  </Popup>
                </div>
                <div className="dropdown__row">
                  <NumberFormat
                    value={minutes}
                    className="input dropdown__input dropdown__input--minutes"
                    placeholder="20"
                    onChange={(e) => setMinutes(e.target.value)}
                    id="minutes"
                  />
                  <label htmlFor="minutes" className="dropdown__text">
                    minutes
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="form__top-button-wrapper">
            <button className="form__top-button">
              <History className="form__top-button-icon" />
            </button>
          </div>
        </div>
        <div className="form__scrollwrapper scrollwrapper">{children}</div>
      </div>
    </div>
  );
}
