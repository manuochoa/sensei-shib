import Gear from "../../icons/Gear";
import History from "./../../icons/History";

import Info from "../../icons/Info";
import NumberFormat from "react-number-format";
import { useState } from "react";

export default function Form({ trade, setTrade, className, title, children }) {
  const [percentage, setPercentage] = useState("");
  const [minutes, setMinutes] = useState("");
  const [switchers, setSwitchers] = useState([false, false, false, false]);
  const [dropdownShowed, setDropdownShowed] = useState(false);

  const setSlippage = (num) => {
    let amountOutMin = ((100 - num) * trade.amountOut) / 100;
    setTrade({ ...trade, slippage: num, amountOutMin });
    console.log(trade);
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
                  <Info className="dropdown__label-icon" />
                </div>
                <div className="dropdown__variants">
                  <ul className="dropdown__variants-list">
                    <li className="dropdown__variants-item">
                      <button className="dropdown__button">0.1%</button>
                    </li>
                    <li className="dropdown__variants-item">
                      <button className="dropdown__button active">0.5%</button>
                    </li>
                    <li className="dropdown__variants-item">
                      <button className="dropdown__button">1%</button>
                    </li>
                  </ul>
                  <div className="input-wrapper input-wrapper--percentage">
                    <NumberFormat
                      // value={trade.slippage}
                      className="input-wrapper__input input dropdown__input"
                      placeholder="0.0001"
                      onChange={(e) => setSlippage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="dropdown__label dropdown__label--mt">
                  <span>Transaction deadline</span>
                  <Info className="dropdown__label-icon" />
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
                <h3 className="dropdown__title dropdown__title--mt">
                  Interface Settings
                </h3>
                <ul className="dropdown__list">
                  <li className="dropdown__item dropdown__label">
                    <span>Toggle Chart</span>
                    <Info className="dropdown__label-icon" />
                    <button
                      className={
                        "switcher dropdown__switcher" +
                        (switchers[0] ? " active" : "")
                      }
                      onClick={() =>
                        setSwitchers(
                          switchers.map((item, index) =>
                            index === 0 ? !item : item
                          )
                        )
                      }
                    />
                  </li>
                  <li className="dropdown__item dropdown__label">
                    <span>Toggle Chart Size Large</span>
                    <Info className="dropdown__label-icon" />
                    <button
                      className={
                        "switcher dropdown__switcher" +
                        (switchers[1] ? " active" : "")
                      }
                      onClick={() =>
                        setSwitchers(
                          switchers.map((item, index) =>
                            index === 1 ? !item : item
                          )
                        )
                      }
                    />
                  </li>
                  <li className="dropdown__item dropdown__label">
                    <span>Toggle Expert Mode</span>
                    <Info className="dropdown__label-icon" />
                    <button
                      className={
                        "switcher dropdown__switcher" +
                        (switchers[2] ? " active" : "")
                      }
                      onClick={() =>
                        setSwitchers(
                          switchers.map((item, index) =>
                            index === 2 ? !item : item
                          )
                        )
                      }
                    />
                  </li>
                  <li className="dropdown__item dropdown__label">
                    <span>Disable Multihops</span>
                    <Info className="dropdown__label-icon" />
                    <button
                      className={
                        "switcher dropdown__switcher" +
                        (switchers[3] ? " active" : "")
                      }
                      onClick={() =>
                        setSwitchers(
                          switchers.map((item, index) =>
                            index === 3 ? !item : item
                          )
                        )
                      }
                    />
                  </li>
                </ul>
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
