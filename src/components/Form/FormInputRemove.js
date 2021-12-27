import NumberFormat from "react-number-format";

export default function FormInputRemove({
  value,
  setValue,
  className,
  LPbalance,
  setRemoveMax,
}) {
  return (
    <div
      className={
        "input-wrapper input-wrapper--form input-wrapper--remove " +
        (className || "")
      }
    >
      <p className="input-wrapper__text">
        Balance: {Number(LPbalance).toFixed(6) || "0"}
        <span onClick={setRemoveMax} className="remove-liquidity-max">
          MAX
        </span>
      </p>
      <div className="input-wrapper__row">
        <NumberFormat
          value={value}
          className="input-wrapper__input input"
          allowEmptyFormatting={false}
          allowLeadingZeros={false}
          allowNegative={false}
          thousandSeparator={true}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
        />
      </div>
    </div>
  );
}
