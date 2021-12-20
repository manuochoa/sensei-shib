import NumberFormat from "react-number-format";
import BNB from '../../icons/BNB';
import ETH from '../../icons/ETH';
import Select from './../common/Select';

export default function FormInputReceive({ value1, setValue1, value2, setValue2, className }) {

    const dropdownList = [
        { title: "BNB", selected: true, icon: BNB, id: 0 },
        { title: "ETH", selected: false, icon: ETH, id: 1 }
    ];

    return (
        <div className={"input-wrapper input-wrapper--form input-wrapper--remove" + (className || "")}>
            <p className="input-wrapper__text">You will Receive</p>
            <div className="input-wrapper__row">
                <div className="input-wrapper input-wrapper--select">
                    <Select list={dropdownList} className="select--form select--input" />
                    <NumberFormat
                        value={value1}
                        className="input-wrapper__input input"
                        allowEmptyFormatting={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        thousandSeparator={true}
                        onChange={(e) => setValue1(e.target.value)}
                        placeholder='0'
                        readOnly={true}
                    />
                </div>
                <div className="input-wrapper input-wrapper--select">
                    <Select list={dropdownList} className="select--form select--input" />
                    <NumberFormat
                        value={value2}
                        className="input-wrapper__input input"
                        allowEmptyFormatting={false}
                        allowLeadingZeros={false}
                        allowNegative={false}
                        thousandSeparator={true}
                        onChange={(e) => setValue2(e.target.value)}
                        placeholder='0'
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    )
}
