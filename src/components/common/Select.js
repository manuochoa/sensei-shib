import React, { useEffect, useState } from "react";
import Enlarge from "../../icons/Enlarge";

export default function Select({
    side,
    setTokens,
    selected,
    className,
    list,
    callback,
}) {
    const [opened, setOpened] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState(list);

    function toggleSelect() {
        setOpened((state) => !opened);
        setSearch("");
    }

    function handleSearch(e) {
        setSearch(e.target.value);
    }

    useEffect(() => {
        function handleDocumentClick(e) {
            if (opened && !e.target.closest('.select')) {
                toggleSelect();
            }
        }

        document.addEventListener("click", handleDocumentClick);

        setFilteredList(list.filter(listItem => (search === "") || (listItem.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))));

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, search]);

    return (
        <div className={"select " + (className || "") + (opened ? " opened" : "")}>
            <button className="select__button" onClick={toggleSelect}>
                <img src={selected.logoURI} alt="" className="select__button-icon" />
                <span className="select__button-text">{selected.symbol}</span>
                <Enlarge className="select__button-arrows" />
            </button>
            <div className="select__wrapper">
                <input className="select__input" placeholder="Search" value={search} onChange={handleSearch} />
                <ul className="select__list scrollwrapper">
                    {filteredList.map((item, index) => {
                        return (
                            <li className="select__item" key={index}>
                                <button
                                    className="select__item-button"
                                    onClick={() => {
                                        setTokens(filteredList[index], side);
                                        toggleSelect();
                                    }}
                                >
                                    <img
                                        src={item.logoURI}
                                        alt=""
                                        className="select__button-icon"
                                    />
                                    <span>{item.symbol}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
