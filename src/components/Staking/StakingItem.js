import React, { useRef, useState } from "react";
import StakingInput from "./StakingInput";

export default function StakingItem({
  item,
  index,
  list,
  mobileScreen,
  userBalance,
  handleStake,
  handleWithdraw,
  handleApprove,
  isLoading,
  isApproved,
}) {
  const [contentHeight, setContentHeight] = useState(list.map((item) => 0));
  const contentWrapper = useRef(null);
  const [value, setValue] = useState("");

  const timeLeft = () => {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    let hours = Math.floor((item.left % day) / hour).toLocaleString(undefined, {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let days = Math.floor(item.left / day);
    let minutes = Math.floor((item.left % hour) / minute).toLocaleString(
      undefined,
      {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }
    );

    console.log(item.left, "time left");

    console.log(days, typeof days, hours, typeof hours);
    if (days === 0 && hours === "00") {
      return `-`;
    } else if (days < 0 && Number(hours) < 0 && Number(minutes) < 0) {
      return `Ready`;
    } else if (days <= 0) {
      return `${hours > 0 ? hours : "0"} Hours, ${minutes} Minutes`;
    }

    return `${days} Days, ${hours} Hours`;
  };

  function toggleContent(index) {
    let textHeight = contentWrapper.current.clientHeight;
    if (contentHeight[index] !== 0) {
      setContentHeight((state) =>
        state.map((item, itemIndex) => (itemIndex === index ? 0 : item))
      );
    } else {
      setContentHeight((state) =>
        state.map((item, itemIndex) =>
          itemIndex === index ? textHeight : item
        )
      );
    }
  }

  const handleClick = () => {
    if (item.staked > 0) {
      checkTime();
      handleWithdraw(index, value);
    } else if (isApproved) {
      if (checkValue()) {
        handleStake(index, value);
      }
    } else {
      handleApprove();
    }
  };

  const checkTime = () => {
    if (item.left > 0) {
      window.alert(
        "Staking period is not over, if you continue you will not receive any rewards."
      );
    }
  };

  const checkValue = () => {
    if (value < item.min) {
      window.alert(`Amount to stake needs to be more than ${item.min}`);
      return false;
    } else if (value > item.max) {
      window.alert(`Amount to stake needs to be less than ${item.max}`);
      return false;
    } else {
      return true;
    }
  };

  return (
    <li className="staking__item staking__background">
      <div className="staking__top">
        <div className="staking__column staking__column--1">
          {mobileScreen && (
            <h2 className="staking__title staking__title--name">Proposal</h2>
          )}
          <div className="staking__proposal">
            {<span>{item.proposal}</span>}
            {item.proposal !== "VIP" && <span>Days</span>}
          </div>
        </div>
        <div className="staking__column staking__column--2">
          {mobileScreen && (
            <h2 className="staking__title staking__title--name">Days Left</h2>
          )}
          <h3 className="staking__item-title">{timeLeft()}</h3>
        </div>
        <div className="staking__column staking__column--3">
          {mobileScreen && (
            <h2 className="staking__title staking__title--name">APR</h2>
          )}
          <h3 className="staking__item-title">{item.apr}%</h3>
        </div>
        <div className="staking__column staking__column--4">
          {mobileScreen && (
            <h2 className="staking__title staking__title--name">Staked</h2>
          )}
          <h3 className="staking__item-title">{item.staked} $SENSEI</h3>
        </div>
        <div className="staking__column staking__column--5">
          {mobileScreen && (
            <h2 className="staking__title staking__title--name">Earnings</h2>
          )}
          <h3 className="staking__item-title">{item.earnings} $SENSEI</h3>
        </div>
        <div className="staking__column staking__column--6">
          <button
            className={
              "staking__trigger" + (contentHeight[index] > 0 ? " active" : "")
            }
            onClick={() => toggleContent(index)}
          ></button>
        </div>
      </div>
      <div
        className="staking__content"
        style={{ height: contentHeight[index] }}
      >
        <div className="staking__content-wrapper" ref={contentWrapper}>
          <div className="staking__item-columns">
            {item.staked > 0 ? (
              <div className="staking__item-column">
                <h4 className="staking__title staking__title--item">
                  Staked:{item.staked} $SENSEI
                </h4>
                <StakingInput
                  value={value}
                  setValue={setValue}
                  buttonTitle="Unstake"
                  userBalance={userBalance}
                  onClick={() => setValue(item.staked)}
                />
              </div>
            ) : (
              <div className="staking__item-column">
                <h4 className="staking__title staking__title--item">
                  Balance: {userBalance} $SENSEI
                </h4>
                <StakingInput
                  value={value}
                  setValue={setValue}
                  buttonTitle="Approve"
                  userBalance={userBalance}
                  onClick={() => setValue(userBalance)}
                />
              </div>
            )}
          </div>

          {Number(item.staked) === 0 && (
            <h4 className="staking__title staking__title--item staking__title--center">
              Min Staking {item.min.toLocaleString("en-US")} - Max{" "}
              {item.max.toLocaleString("en-US")} $SENSEI
            </h4>
          )}

          <h4 className="staking__title staking__title--item staking__title--center">
            Earnings: {item.earnings} $SENSEI
          </h4>
          <button
            disabled={isLoading}
            onClick={handleClick}
            className="button button--red staking__item-button"
          >
            {item.staked > 0
              ? "Claim Rewards"
              : isApproved
              ? "Stake"
              : "Approve"}
          </button>
        </div>
      </div>
    </li>
  );
}
