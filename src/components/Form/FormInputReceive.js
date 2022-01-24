import NumberFormat from "react-number-format";
import Select from "./../common/Select";

export default function FormInputReceive({
  tokens,
  value1,
  setValue,
  value2,
  setTokens,
  className,
  selected1,
  selected2,
}) {
  return (
    <div
      className={
        "input-wrapper input-wrapper--form input-wrapper--remove" +
        (className || "")
      }
    >
      <p className="input-wrapper__text">You will Receive</p>
      <div className="input-wrapper__row">
        <div className="input-wrapper input-wrapper--select">
          <Select
            side={"from"}
            setTokens={setTokens}
            selected={selected1}
            list={tokens}
            className="select--form select--input"
          />
          <NumberFormat
            value={value1}
            className="input-wrapper__input input"
            allowEmptyFormatting={false}
            allowLeadingZeros={false}
            allowNegative={false}
            thousandSeparator={true}
            onChange={(e) => setValue(e.target.value, "from")}
            placeholder="0"
            readOnly={true}
          />
        </div>
        <div className="input-wrapper input-wrapper--select">
          <Select
            side={"to"}
            setTokens={setTokens}
            selected={selected2}
            list={tokens}
            className="select--form select--input"
          />
          <NumberFormat
            value={value2}
            className="input-wrapper__input input"
            allowEmptyFormatting={false}
            allowLeadingZeros={false}
            allowNegative={false}
            thousandSeparator={true}
            onChange={(e) => setValue(e.target.value, "to")}
            placeholder="0"
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
}
