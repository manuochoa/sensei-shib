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
  const [selectList, setSelectList] = useState(list);
  const [opened, setOpened] = useState(false);
  let selectedTitle = selectList.find((item) => item.selected === true).symbol;
  let SelectedIcon = selectList.find((item) => item.selected === true).logoURI;

  function selectItem(index) {
    console.log(index, selectList[index]);
    setSelectList((state) =>
      state.map((item, itemIndex) => ({
        ...item,
        selected: itemIndex === index ? true : false,
      }))
    );
    callback && callback(index);
  }

  function toggleSelect() {
    setOpened((state) => !opened);
  }

  useEffect(() => {
    function handleDocumentClick() {
      if (opened) {
        toggleSelect();
      }
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [opened]);

  return (
    <div className={"select " + (className || "") + (opened ? " opened" : "")}>
      <button className="select__button" onClick={toggleSelect}>
        <img src={selected.logoURI} className="select__button-icon" />
        <span className="select__button-text">{selected.symbol}</span>
        <Enlarge className="select__button-arrows" />
      </button>
      <ul className="select__list">
        {list.map((item, index) => {
          return (
            <li className="select__item" key={index}>
              <button
                className="select__item-button"
                onClick={() => {
                  setTokens(list[index], side);
                }}
              >
                <img src={item.logoURI} className="select__button-icon" />
                <span>{item.symbol}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
