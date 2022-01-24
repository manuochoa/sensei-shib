import React, { useRef, useState } from 'react'
import StakingInput from './StakingInput';

export default function StakingItem({ item, index, list, mobileScreen }) {
    const [contentHeight, setContentHeight] = useState(list.map(item => 0));
    const contentWrapper = useRef(null);
    const [approveValue, setApproveValue] = useState("");
    const [unstakeValue, setUnstakeValue] = useState("");

    function toggleContent(index) {
        let textHeight = contentWrapper.current.clientHeight;
        if (contentHeight[index] !== 0) {
            setContentHeight(state => state.map((item, itemIndex) => itemIndex === index ? 0 : item));
        } else {
            setContentHeight(state => state.map((item, itemIndex) => itemIndex === index ? textHeight : item));
        }
    }

    return (
        <li className="staking__item staking__background">
            <div className="staking__top">
                <div className="staking__column staking__column--1">
                    {mobileScreen && <h2 className="staking__title staking__title--name">Proposal</h2>}
                    <div className="staking__proposal">
                        {<span>{item.proposal}</span>}
                        {item.proposal !== "VIP" && <span>Days</span>}
                    </div>
                </div>
                <div className="staking__column staking__column--2">
                    {mobileScreen && <h2 className="staking__title staking__title--name">Days Left</h2>}
                    <h3 className="staking__item-title">{item.left} Days</h3>
                </div>
                <div className="staking__column staking__column--3">
                    {mobileScreen && <h2 className="staking__title staking__title--name">APR</h2>}
                    <h3 className="staking__item-title">{item.apr}%</h3>
                </div>
                <div className="staking__column staking__column--4">
                    {mobileScreen && <h2 className="staking__title staking__title--name">Staked</h2>}
                    <h3 className="staking__item-title">{item.staked} $SENSEI</h3>
                </div>
                <div className="staking__column staking__column--5">
                    {mobileScreen && <h2 className="staking__title staking__title--name">Earnings</h2>}
                    <h3 className="staking__item-title">{item.earnings} ADA</h3>
                </div>
                <div className="staking__column staking__column--6">
                    <button className={"staking__trigger" + (contentHeight[index] > 0 ? " active" : "")} onClick={() => toggleContent(index)}></button>
                </div>
            </div>
            <div className="staking__content" style={{ height: contentHeight[index] }}>
                <div className="staking__content-wrapper" ref={contentWrapper}>
                    <div className="staking__item-columns">
                        <div className="staking__item-column">
                            <h4 className="staking__title staking__title--item">Balance: 345123,12 $SENSEI</h4>
                            <StakingInput value={approveValue} setValue={setApproveValue} buttonTitle="Approve" />
                        </div>
                        <div className="staking__item-column">
                            <h4 className="staking__title staking__title--item">Staked: 3211.12 $SENSEI</h4>
                            <StakingInput value={unstakeValue} setValue={setUnstakeValue} buttonTitle="Unstake" />
                        </div>
                    </div>
                    <h4 className="staking__title staking__title--item staking__title--center">Earnings: 33.12 ADA</h4>
                    <button className="button button--red staking__item-button">Claim Rewards</button>
                </div>
            </div>
        </li>
    )
}
