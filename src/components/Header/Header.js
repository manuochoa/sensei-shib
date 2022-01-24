import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/common/logo.png";
import More from "./../../icons/More";
import { useLocation } from "react-router-dom";
import addToRefs from './../../services/addToRefs';

const menu = [
    {
        title: "Trade",
        id: 0,
        submenu: [
            { title: "Exchange", to: "/exchange", id: 0, disabled: false },
            { title: "Liquidity", to: "/liquidity", id: 1, disabled: false },
        ],
    },
    {
        title: "Vesting",
        id: 1,
        submenu: [{ title: "Vesting", to: "/vesting", id: 0, disabled: false }],
    },
    {
        title: "Earn",
        id: 2,
        submenu: [{ title: "Coming Soon...", to: "#", id: 0, disabled: false }],
    },
    {
        title: "NFT",
        id: 3,
        submenu: [{ title: "Coming Soon...", to: "#", id: 0, disabled: false }],
    },
    {
        title: "Staking",
        to: "/staking",
        id: 3,
    },
];

export default function Header({ popupShow, setPopupShow, userAddress, setUserAddress, disconnectWallet, mobileScreen }) {
    const location = useLocation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [subMenuListHeights, setSubMenuListHeights] = useState([]);
    const subMenuLists = useRef([]);

    function checkUrl(url) {
        let current_path = location.pathname;
        return url === current_path;
    }

    function toggleContent(index) {
        let elementHeight = subMenuLists.current[index].clientHeight;

        if (subMenuListHeights[index] !== 0) {
            setSubMenuListHeights(state => state.map((item, itemIndex) => itemIndex === index ? 0 : item));
        } else {
            setSubMenuListHeights(state => state.map((item, itemIndex) => itemIndex === index ? elementHeight : item));
        }
    }

    useEffect(() => {
        setSubMenuListHeights(subMenuLists.current.map(() => 0));
    }, [menuVisible]);

    return (
        <header className="header">
            <div className="header__wrapper container">
                <Link to="/" className="header__logo">
                    <img src={logo} alt="logo" className="header__logo-image" />
                </Link>
                <ul className={"header__menu" + (menuVisible ? " opened" : "")}>
                    {menu.map((item, index) => {
                        return (
                            <li className="header__menu-item" key={index}>
                                {item.to ?
                                    <Link
                                        key={item.id}
                                        to={item.to}
                                        className={"header__menu-link" + (checkUrl(item.to) ? " active" : "")}
                                        onClick={mobileScreen ? () => setMenuVisible(!menuVisible) : () => false}>{item.title}</Link>
                                    :
                                    <>
                                        <button className="header__menu-link" onClick={mobileScreen ? () => toggleContent(index) : () => false}>{item.title}</button>
                                        {item.submenu &&
                                            <div className="header__submenu" style={{ height: mobileScreen ? subMenuListHeights[index] : "auto" }}>
                                                <ul className="header__submenu-list" ref={el => addToRefs(el, subMenuLists)}>
                                                    {item.submenu.map(subItem => {
                                                        return (
                                                            <li className="header__submenu-item" key={subItem.id}>
                                                                <Link
                                                                    to={subItem.to}
                                                                    className={"header__submenu-link" + (checkUrl(subItem.to) ? " active" : "")}
                                                                    onClick={mobileScreen ? () => setMenuVisible(!menuVisible) : () => false}
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        }
                                    </>
                                }
                            </li>
                        );
                    })}
                </ul>
                <div className="header__wrapper-inner">
                    {/* <input
            value="$1.05"
            className="input header__input price-input"
            readOnly
          /> */}
                    {/* <div></div> */}
                    {userAddress !== "" ? (
                        <button className={"button button--header button--red" + (popupShow ? " active" : "")} onClick={() => disconnectWallet()}>
                            <span>
                                {userAddress.slice(0, 6)}...{userAddress.slice(-10)}
                            </span>
                        </button>
                    ) : (
                        <button className={"button button--header button--red" + (popupShow ? " active" : "")} onClick={() => setPopupShow((state) => !state)}>
                            Connect Wallet
                        </button>
                    )}
                    <button className="button button--more">
                        <More className="button__icon" />
                    </button>
                </div>
                <button className={"header__mobile-button" + (menuVisible ? " active" : "")} onClick={() => setMenuVisible(!menuVisible)}>
                    <span className="header__mobile-button-wrapper"></span>
                </button>
            </div>
        </header>
    );
}
