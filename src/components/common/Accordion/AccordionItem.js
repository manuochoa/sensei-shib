import React, { useRef, useState } from 'react'

export default function AccordionItem({ item, index, list }) {
    const [contentHeight, setContentHeight] = useState(list.map(item => 0));
    const textWrapper = useRef(null);

    function toggleContent(index) {
        let textHeight = textWrapper.current.clientHeight;
        if (contentHeight[index] !== 0) {
            setContentHeight(state => state.map((item, itemIndex) => itemIndex === index ? 0 : item));
        } else {
            setContentHeight(state => state.map((item, itemIndex) => itemIndex === index ? textHeight : item));
        }
    }

    return (
        <li className="accordion__item">
            <div className="accordion__wrapper">
                <button className={"accordion__button" + (contentHeight[index] > 0 ? " active" : "")} onClick={() => toggleContent(index)}>
                    <span>{item.title}</span>
                    <span className="accordion__pm"></span>
                </button>
                <div className="accordion__content" style={{ height: contentHeight[index] }}>
                    <div className="accordion__text-wrapper" ref={textWrapper}>
                        <p className="accordion__text" dangerouslySetInnerHTML={{ __html: item.text }}></p>
                    </div>
                </div>
            </div>
        </li>
    )
}
