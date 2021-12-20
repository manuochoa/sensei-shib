import NumberFormat from 'react-number-format';

export default function FormInputRemove({ value, setValue, className }) {

    return (
        <div className={"input-wrapper input-wrapper--form input-wrapper--remove " + (className || "")}>
            <p className="input-wrapper__text">Amount to Remove</p>
            <div className="input-wrapper__row">
                <NumberFormat
                    value={value}
                    className="input-wrapper__input input"
                    allowEmptyFormatting={false}
                    allowLeadingZeros={false}
                    allowNegative={false}
                    thousandSeparator={true}
                    onChange={(e) => setValue(e.target.value)}
                    suffix='%'
                    placeholder='0'
                />
            </div>
        </div>
    )
}
