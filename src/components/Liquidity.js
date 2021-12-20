import { useState } from "react";
import { Link } from "react-router-dom";
import Form from "./Form/Form";
import FormInput from "./Form/FormInput";
import FormInputRemove from "./Form/FormInputRemove";
import FormInputReceive from './Form/FormInputReceive';

export default function Liquidity() {
    const [inputValue1, setInputValue1] = useState(345);
    const [inputValue2, setInputValue2] = useState(3.49965);
    const [percentage, setPercentage] = useState(0);
    const [receivedValue, setRceivedValue] = useState([36.004, 446.004]);
    const [accounts] = useState([""]);
    const [addTab, setAddTab] = useState(true);

    return (
        <Form className="form--liquidity" title="Liquidity">
            <div className="form__tip">
                <strong>Tip:</strong> When you add liquidity, you will receive pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
            </div>
            <div className="form__tab-buttons">
                <button className={"form__tab-button" + (addTab ? " active" : "")} onClick={() => setAddTab(true)}>Add</button>
                <button className={"form__tab-button" + (addTab ? "" : " active")} onClick={() => setAddTab(false)}>Remove</button>
            </div>
            {addTab ?
                <FormInput value={inputValue1} setValue={setInputValue1} title="Input" /> :
                <FormInputRemove value={percentage} setValue={setPercentage} />
            }

            <button className="button button--round button--plus form__round">
                <span className="plus button__icon"></span>
            </button>
            {addTab ?
                <FormInput value={inputValue2} setValue={setInputValue2} title="Input" /> :
                <FormInputReceive
                    value1={receivedValue[0]}
                    value2={receivedValue[1]}
                    setValue1={(value) => setRceivedValue(state => state.map((item, index) => index === 0 ? value : item))}
                    setValue2={(value) => setRceivedValue(state => state.map((item, index) => index === 1 ? value : item))}
                />
            }

            <div className="form__row">
                <p className="form__text">Current Rate</p>
                <span className="form__text form__text--main">99.9849 BNB per ETH</span>
            </div>
            {accounts[0] ?
                <button className="button button--red button--form">Connect Wallet</button> :
                (addTab ?
                    <button className="button button--red button--form">Add Liquidity</button> :
                    <button className="button button--red button--form">Remove Liquidity</button>)

            }
            <div className="form__tip form__tip--mt">
                ⭐️ By adding liquidity you'll earn a percentage of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. <Link to="/"><strong>Learn More</strong></Link>
            </div>
        </Form>
    )
}
