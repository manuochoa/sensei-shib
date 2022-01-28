import { useState, useEffect } from "react";
import stakingIcon from "../../img/staking/staking.svg";
import StakingItem from "./StakingItem";
import Accordion from "./../common/Accordion/Accordion";
import {
  stake,
  withdraw,
  getDepositData,
  approveStake,
  checkAllowance,
  tokenBalance,
} from "../../blockchain/staking";

const questions = [
  {
    title: "Why Stake with Sensei Swap?",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. <br><br> Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia",
  },
  {
    title: "How Does the 30-Day Staking Pool Work?",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. <br><br> Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia",
  },
  {
    title: "How Does the 90-Day Staking Pool Work?",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. <br><br> Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia",
  },
  {
    title: "How Does the VIP Staking Pool Work?",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia. <br><br> Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia",
  },
];

export default function Staking({ mobileScreen, walletType, userAddress }) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setUserBalance] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [totalStaked, setTotalStaked] = useState("");
  const [totalEarned, setTotalEarned] = useState("");
  const [stakingList, setStakingList] = useState([
    {
      proposal: 30,
      left: 0,
      apr: 120,
      staked: 0,
      earnings: 0,
      id: 0,
      min: 50000000,
      max: 500000000,
    },
    {
      proposal: 90,
      left: 0,
      apr: 200,
      staked: 0,
      earnings: 0,
      id: 1,
      min: 50000000,
      max: 500000000,
    },
    {
      proposal: "VIP",
      left: 0,
      apr: 300,
      staked: 0,
      earnings: 0,
      id: 3,
      min: 1000000000,
      max: 2500000000,
    },
  ]);

  const handleStake = async (level, amount) => {
    setIsLoading(true);
    let receipt = await stake(amount, level, userAddress, walletType);
    if (receipt) {
      console.log(receipt);
      UserDepositData();
    }
    setIsLoading(false);
  };

  const handleWithdraw = async (level, amount) => {
    setIsLoading(true);
    let receipt = await withdraw(amount, level, userAddress, walletType);
    if (receipt) {
      console.log(receipt);
      UserDepositData();
    }
    setIsLoading(false);
  };

  const UserDepositData = async () => {
    if (userAddress) {
      let data = await getDepositData(userAddress);
      let balance = await tokenBalance(userAddress);
      let approval = await checkAllowance(userAddress);
      let staked = 0;
      let earned = 0;
      if (data || balance || approval) {
        console.log(data, balance / 10 ** 9, approval);
        let stakingInfo = stakingList;
        stakingInfo.map((el, i) => {
          staked += Number(data[i].balance);
          earned += Number(data[i].earnings);
          let dateFinish = data[i].timeFinish * 1000 - Date.now();
          if (data[i].timeFinish === "0") {
            dateFinish = 0;
          }
          stakingInfo[i] = {
            ...el,
            left: dateFinish,
            staked: data[i].balance / 10 ** 9,
            earnings: data[i].earnings / 10 ** 9,
          };
        });

        setTotalEarned(earned / 10 ** 9);
        setTotalStaked(staked / 10 ** 9);
        setStakingList(stakingInfo);
        setUserBalance(balance / 10 ** 9);
        setIsApproved(approval);
      }
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    let receipt = await approveStake(userAddress, walletType);
    if (receipt) {
      console.log(receipt);
      UserDepositData();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    UserDepositData();
  }, [userAddress]);

  return (
    <div className="staking container">
      <div className="staking__banner staking__background">
        <div className="staking__banner-column staking__banner-column--1">
          <h3 className="staking__title staking__title--mb">Staking Balance</h3>
          <p className="staking__balance">
            {totalStaked
              ? `${Number(totalStaked).toFixed(0)} $SENSEI`
              : "0 $SENSEI"}
          </p>
        </div>
        <div className="staking__banner-column staking__banner-column--2">
          <img src={stakingIcon} className="staking__icon" alt="Staking" />
        </div>
        <div className="staking__banner-column staking__banner-column--3">
          <h3 className="staking__title staking__title--mb">Total Earnings</h3>
          <p className="staking__balance">
            {totalEarned
              ? `+${Number(totalEarned).toFixed(0)} $SENSEI`
              : "0 $SENSEI"}
          </p>
        </div>
        <div className="staking__banner-column staking__banner-column--4">
          <h3 className="staking__title staking__title--mb">Balance</h3>
          <p className="staking__balance staking__balance--big">
            {balance ? `+${balance} $SENSEI` : "0 $SENSEI"}
          </p>
        </div>
      </div>
      {!mobileScreen && (
        <div className="staking__header">
          <div className="staking__column staking__column--1">
            <h4 className="staking__title">Proposal</h4>
          </div>
          <div className="staking__column staking__column--2">
            <h4 className="staking__title">Days Left</h4>
          </div>
          <div className="staking__column staking__column--3">
            <h4 className="staking__title">APR</h4>
          </div>
          <div className="staking__column staking__column--4">
            <h4 className="staking__title">Staked</h4>
          </div>
          <div className="staking__column staking__column--5">
            <h4 className="staking__title">Earnings</h4>
          </div>
          <div className="staking__column staking__column--6">
            <h4 className="staking__title">Action</h4>
          </div>
        </div>
      )}
      <ul className="staking__list">
        {stakingList.map((item, index) => {
          return (
            <StakingItem
              item={item}
              index={index}
              list={stakingList}
              key={index}
              mobileScreen={mobileScreen}
              userBalance={balance}
              handleStake={handleStake}
              handleWithdraw={handleWithdraw}
              handleApprove={handleApprove}
              isLoading={isLoading}
              isApproved={isApproved}
            />
          );
        })}
      </ul>
      <div className="staking__faq staking__background">
        <h1 className="staking__faq-title">How to Stake?</h1>
        <Accordion className="accordion--staking" list={questions} />
      </div>
    </div>
  );
}
