import { useCallback, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import getInputWidth from "./../../services/getInputWidth";
import Select from "./../common/Select";

export default function FormInput({
  tokens,
  value,
  setValue,
  className,
  selected,
  setTokens,
  title,
  side,
  balance,
}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleWindowWidth = useCallback(() => {
    setWindowWidth(
      (window.innerWidth < 620 && window.innerWidth >= 480 && "medium") ||
        (window.innerWidth < 480 && "small")
    );
  }, []);

  useEffect(() => {
    handleWindowWidth();
    window.addEventListener("resize", handleWindowWidth);

    return () => {
      window.removeEventListener("resize", handleWindowWidth);
    };
  }, [handleWindowWidth]);

  return (
    <div className={"input-wrapper input-wrapper--form " + (className || "")}>
      <div className="input-wrapper__column">
        <p className="input-wrapper__text">
          Balance:{" "}
          {balance !== "" && (
            <>
              {balance}{" "}
              <span
                className="max-button"
                onClick={() => setValue(balance, side)}
              >
                Max
              </span>
            </>
          )}
        </p>
        <Select
          side={side}
          selected={selected}
          setTokens={setTokens}
          list={tokens}
          className="select--form"
        />
      </div>
      <div className="input-wrapper__column">
        <p className="input-wrapper__text">{title}</p>
        <div className="input-wrapper__row">
          {/* <p className="input-wrapper__text">~$166872.67</p> */}
          <NumberFormat
            value={value}
            className="input-wrapper__input input"
            allowEmptyFormatting={false}
            allowLeadingZeros={false}
            allowNegative={false}
            // thousandSeparator={true}
            onChange={(e) => setValue(e.target.value, side)}
            style={{ width: getInputWidth(value, windowWidth) }}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
