import Check from "../../icons/Check";
import AllocationCard from "./AllocationCard";

const progress = [
    { state: "done", percentage: 25, id: 0 },
    { state: "active", percentage: 50, id: 1 },
    { state: "", percentage: 75, id: 2 },
    { state: "", percentage: 100, id: 3 }
];

const cards = [
    { title: "Level 1 (25%)", state: "active", date: "12.08.2021", id: 0 },
    { title: "Level 2 (50%)", state: "ready", date: "", id: 1 },
    { title: "Level 3 (75%)", state: "", date: "01.02.2022", id: 2 },
    { title: "Level 4 (100%)", state: "", date: "01.05.2022", id: 3 },
];

export default function Allocation() {
    return (
        <div className="form form--allocation container">
            <div className="form__wrapper">
                <div className="form__container form__container--top">
                    <ul className="form__progress">
                        {progress.map(item => {
                            return (
                                <li className={"form__progress-item" + (item.state === "done" ? " done" : item.state === "active" ? "" : " empty")} key={item.id}>
                                    <div className="form__progress-wrapper">
                                        {item.state === "done" && <Check className="form__progress-icon" />}
                                        <div className="form__progress-percentage">{item.percentage}%</div>
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
                                <span>25% Collected</span>
                                <span>250.000/1.000.000</span>
                            </div>
                            <div className="form__collected-bar">
                                <div className="form__collected-track" style={{ width: "25%" }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="form__scrollwrapper scrollwrapper">
                        <ul className="cards-list cards-list--allocation">
                            {cards.map(item => {
                                return (
                                    <li className="cards-list__item" key={item.id}>
                                        <AllocationCard item={item} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
