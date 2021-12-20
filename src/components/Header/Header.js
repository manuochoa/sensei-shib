import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/common/logo.png";
import More from "./../../icons/More";
import Docs from "./../../icons/Docs";
import { useLocation } from "react-router-dom";

const menu = [
  { title: "Swap", to: "/swap", id: 0 },
  { title: "Liquidity", to: "/liquidity", id: 1 },
];

export default function Header({ popupShow, setPopupShow, userAddress }) {
  const [accounts] = useState([""]);
  const location = useLocation();
  const [mobileScreen, setMobileScreen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  function checkUrl(url) {
    let current_path = location.pathname;
    return url === current_path;
  }

  function handleMobileScreen() {
    setMobileScreen(window.innerWidth < 768);
  }

  useEffect(() => {
    setMobileScreen(handleMobileScreen);

    window.addEventListener("resize", handleMobileScreen);

    return () => {
      window.removeEventListener("resize", handleMobileScreen);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__wrapper container">
        <Link to="/" className="header__logo">
          <img src={logo} alt="logo" className="header__logo-image" />
        </Link>
        <ul className={"header__menu" + (menuVisible ? " opened" : "")}>
          {menu.map((item) => {
            return (
              <li className="header__menu-item" key={item.id}>
                <Link
                  to={item.to}
                  className={
                    "header__menu-link" + (checkUrl(item.to) ? " active" : "")
                  }
                  onClick={
                    mobileScreen
                      ? () => setMenuVisible(!menuVisible)
                      : () => false
                  }
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="header__wrapper-inner">
          <input value="$1.03" className="input header__input" readOnly />
          {userAddress !== "" ? (
            <button
              className={
                "button button--header button--red" +
                (popupShow ? " active" : "")
              }
            >
              <span>
                {userAddress.slice(0, 6)}...{userAddress.slice(-10)}
              </span>
            </button>
          ) : (
            <button
              className={
                "button button--header button--red" +
                (popupShow ? " active" : "")
              }
              onClick={() => setPopupShow((state) => !state)}
            >
              Connect Wallet
            </button>
          )}
          <button className="button button--more">
            <More className="button__icon" />
          </button>
        </div>
        <button
          className={"header__mobile-button" + (menuVisible ? " active" : "")}
          onClick={() => setMenuVisible(!menuVisible)}
        >
          <span className="header__mobile-button-wrapper"></span>
        </button>
      </div>
    </header>
  );
}
