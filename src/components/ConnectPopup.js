import Popup from "./common/Popup";
import metamask from "../img/svg/metamask.svg";
import wc from "../img/svg/wc.svg";

export default function ConnectPopup({
  connectMetamask,
  connectWalletConnect,
  popupShow,
  setPopupShow,
}) {
  return (
    <Popup
      popupShow={popupShow}
      setPopupShow={setPopupShow}
      className="popup--connect"
    >
      <div className="popup__row">
        <h1 className="popup__title">Connect Wallet</h1>
        <button
          className="popup__remove remove"
          onClick={() => setPopupShow(false)}
        ></button>
      </div>
      <ul className="popup__list">
        <li className="popup__item">
          <button onClick={connectMetamask} className="popup__button">
            <span>Metamask</span>
            <img src={metamask} alt="metamask" className="popup__button-icon" />
          </button>
        </li>
        {/* <li className="popup__item">
          <button className="popup__button">
            <span>Binance Chain Wallet</span>
            <img src={bsc} alt="metamask" className="popup__button-icon" />
          </button>
        </li> */}
        <li className="popup__item">
          <button onClick={connectWalletConnect} className="popup__button">
            <span>WalletConnect</span>
            <img src={wc} alt="metamask" className="popup__button-icon" />
          </button>
        </li>
      </ul>
      <div className="popup__row popup__row--footer">
        <span className="popup__text">New to Blockchain?</span>
        &nbsp;&nbsp;
        <a href="/" className="popup__text popup__text--link">
          Learn more about wallets
        </a>
      </div>
    </Popup>
  );
}
