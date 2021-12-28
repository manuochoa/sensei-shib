import { useState, useEffect } from "react";
import Check from "../../icons/Check";
import AllocationCard from "./AllocationCard";
import { checkAllocationStatus, claim } from "../../blockchain/exchange";

export default function Allocation({ walletType, userAddress }) {
  const [userAllocation, setUserAllocation] = useState("0");
  const [userAllocationClaimed, setUserAllocationClaimed] = useState("1");
  const [stagesCollected, setStagesCollected] = useState(0);
  const [progress, setProgress] = useState([
    { state: "", percentage: 25, id: 0 },
    { state: "", percentage: 50, id: 1 },
    { state: "", percentage: 75, id: 2 },
    { state: "", percentage: 100, id: 3 },
  ]);

  const [cards, setCards] = useState([
    { title: "Level 1 (25%)", state: "", date: "", id: 0 },
    { title: "Level 2 (50%)", state: "", date: "", id: 1 },
    { title: "Level 3 (75%)", state: "", date: "", id: 2 },
    { title: "Level 4 (100%)", state: "", date: "", id: 3 },
  ]);

  const getAllocationDetails = async () => {
    if (userAddress) {
      let result = await checkAllocationStatus(userAddress, walletType);
      console.log(Date.now(), "now");

      const temp = progress;
      const tempCard = cards;
      const startTime = new Date(result.startTime * 1000).toString().split(" ");
      const firstRelease = new Date(result.startTime * 1000 + 600000)
        .toString()
        .split(" ");
      const secondRelease = new Date(result.startTime * 1000 + 600000 * 2)
        .toString()
        .split(" ");
      const thirdRelease = new Date(result.startTime * 1000 + 600000 * 3)
        .toString()
        .split(" ");
      console.log(startTime.toString().split(" "));

      tempCard[0].date = `${startTime[1]} ${startTime[2]}, ${startTime[3]}, ${startTime[4]}`;
      tempCard[1].date = `${firstRelease[1]} ${firstRelease[2]}, ${firstRelease[3]}, ${firstRelease[4]}`;
      tempCard[2].date = `${secondRelease[1]} ${secondRelease[2]}, ${secondRelease[3]}, ${secondRelease[4]}`;
      tempCard[3].date = `${thirdRelease[1]} ${thirdRelease[2]}, ${thirdRelease[3]}, ${thirdRelease[4]}`;
      if (result) {
        let claimed = 0;
        result.stages.map((el, index) => {
          if (el === true) {
            temp[index].state = "done";
            tempCard[index].state = "active";
            claimed++;
          } else {
            temp[index].state = "";
            tempCard[index].state = "";

            console.log(
              Date.now() > result.startTime * 1000 + 600000 * index,
              Date.now(),
              result.startTime * 1000 + 600000 * index,
              result.startTime,
              "time"
            );
            if (Date.now() > result.startTime * 1000 + 600000 * index) {
              temp[index].state = "active";
              tempCard[index].state = "ready";
              console.log("active");
            }
          }
        });
        console.log(temp);
        let allocation = (result.userAllocation / 10 ** 18).toFixed(2);
        setUserAllocation(allocation);
        setUserAllocationClaimed((allocation / 4) * claimed);
        setStagesCollected(claimed);
      }
      setCards(tempCard);
      setProgress(temp);
    }
  };

  const claimStage = async (stage) => {
    let receipt = await claim(stage, userAddress, walletType);
    if (receipt) {
      getAllocationDetails();
      console.log(receipt);
    }
  };

  useEffect(() => {
    getAllocationDetails();
  }, [userAddress]);
  return (
    <div className="form form--allocation container">
      <div className="form__wrapper">
        <div className="form__container form__container--top">
          <ul className="form__progress">
            {progress.map((item) => {
              return (
                <li
                  className={
                    "form__progress-item" +
                    (item.state === "done"
                      ? " done"
                      : item.state === "active"
                      ? ""
                      : " empty")
                  }
                  key={item.id}
                >
                  <div className="form__progress-wrapper">
                    {item.state === "done" && (
                      <Check className="form__progress-icon" />
                    )}
                    <div className="form__progress-percentage">
                      {item.percentage}%
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="form__container form__container--bottom">
          <div className="form__top">
            <h1 className="form__title">Token Allocation</h1>
            <div className="form__collected">
              <div className="form__collected-row">
                <span>{stagesCollected * 25}% Collected</span>
                <span>
                  {userAllocationClaimed}/{userAllocation}
                </span>
              </div>
              <div className="form__collected-bar">
                <div
                  className="form__collected-track"
                  style={{ width: `${stagesCollected * 25}` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="form__scrollwrapper scrollwrapper">
            <ul className="cards-list cards-list--allocation">
              {cards.map((item, index) => {
                return (
                  <li className="cards-list__item" key={item.id}>
                    <AllocationCard
                      claimStage={claimStage}
                      item={item}
                      stage={index}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
