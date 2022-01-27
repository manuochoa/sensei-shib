import NumberFormat from "react-number-format";

export default function StakingInput({
  value,
  setValue,
  buttonTitle,
  onClick,
  userBalance,
}) {
  function handleInputChange(e) {
    setValue(e.target.value);
  }

  return (
    <div className="input-wrapper input-wrapper--staking">
      <div className="input-wrapper__row">
        <NumberFormat
          className="input input-wrapper__input"
          value={value}
          onChange={handleInputChange}
          placeholder={
            buttonTitle === "Unstake" ? "Amount to Withdraw" : "Enter value"
          }
          //   thousandSeparator={true}
          allowLeadingZeros={false}
          allowNegative={false}
        />
        <button onClick={onClick} className="input-wrapper__max">
          MAX
        </button>
      </div>
      {/* <button className="input-wrapper__button" onClick={onClick}>{buttonTitle}</button> */}
    </div>
  );
}
