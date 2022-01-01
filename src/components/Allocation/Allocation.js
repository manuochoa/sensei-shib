import { useState, useEffect } from "react";
import Check from "../../icons/Check";
import AllocationCard from "./AllocationCard";
import { checkAllocationStatus, claim } from "../../blockchain/exchange";

export default function Allocation({ walletType, userAddress }) {
  const [userAllocation, setUserAllocation] = useState("0");
  const [userAllocationClaimed, setUserAllocationClaimed] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [stagesCollected, setStagesCollected] = useState(0);
  const [progress, setProgress] = useState([
    { state: "", percentage: 30, id: 0 },
    { state: "", percentage: 40, id: 1 },
    { state: "", percentage: 50, id: 2 },
    { state: "", percentage: 60, id: 3 },
    { state: "", percentage: 70, id: 3 },
    { state: "", percentage: 80, id: 3 },
    { state: "", percentage: 90, id: 3 },
    { state: "", percentage: 100, id: 3 },
  ]);

  const [cards, setCards] = useState([
    { title: "Level 1 (30%)", state: "", date: "", id: 0 },
    { title: "Level 2 (40%)", state: "", date: "", id: 1 },
    { title: "Level 3 (50%)", state: "", date: "", id: 2 },
    { title: "Level 4 (60%)", state: "", date: "", id: 3 },
    { title: "Level 5 (70%)", state: "", date: "", id: 4 },
    { title: "Level 6 (80%)", state: "", date: "", id: 5 },
    { title: "Level 7 (90%)", state: "", date: "", id: 6 },
    { title: "Level 8 (100%)", state: "", date: "", id: 7 },
  ]);

  const getAllocationDetails = async () => {
    if (userAddress) {
      let result = await checkAllocationStatus(userAddress, walletType);
      console.log(Date.now(), "now");

      const temp = progress;
      const tempCard = cards;
      tempCard.map((el, index) => {
        const startTime = new Date(result.startTime * 1000 + 600000 * index)
          .toString()
          .split(" ");
        tempCard[
          index
        ].date = `${startTime[1]} ${startTime[2]}, ${startTime[3]}, ${startTime[4]}`;
      });

      if (result) {
        let claimed = 0;
        result.stages.map((el, index) => {
          if (el === true) {
            if (index === 0) {
              claimed = claimed + 3;
            } else {
              claimed++;
            }
            temp[index].state = "done";
            tempCard[index].state = "active";
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
        setUserAllocationClaimed((allocation / 10) * claimed);
        setStagesCollected(claimed);
      }
      setCards(tempCard);
      setProgress(temp);
    }
  };

  const claimStage = async (stage) => {
    setIsLoading(true);
    let receipt = await claim(stage, userAddress, walletType);
    if (receipt) {
      getAllocationDetails();
      console.log(receipt);
    }
    setIsLoading(false);
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
                      isLoading={isLoading}
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
