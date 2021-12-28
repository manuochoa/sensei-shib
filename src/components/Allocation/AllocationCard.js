import lock from "../../img/svg/lock.svg";

export default function AllocationCard({ item, stage, claimStage }) {
  return (
    <div
      className={
        "card card--allocation" +
        (item.state === "active"
          ? " active"
          : item.state === "ready"
          ? " ready"
          : "")
      }
    >
      <div className="card__icon-wrapper">
        <img src={lock} className="card__icon" alt="lock" />
      </div>
      <div className="card__column">
        <h2 className="card__title">{item.title}</h2>
        {item.state === "ready" ? (
          <div className="card__text">Ready to Claim</div>
        ) : (
          <div className="card__text">
            <span>
              {item.state === "active" ? "Collected:" : "Est. Claim Date:"}
            </span>
            <span>{item.date}</span>
          </div>
        )}
      </div>
      {item.state === "ready" && (
        <button
          onClick={() => claimStage(stage)}
          className="button button--red card__button"
        >
          Claim
        </button>
      )}
    </div>
  );
}
