import AccordionItem from './AccordionItem';

export default function Accordion({ list, className }) {

    return (
        <div className={"accordion " + (className || "")}>
            <ul className="accordion__list">
                {list.map((item, index) => {
                    return (
                        <AccordionItem item={item} index={index} list={list} key={index} />
                    );
                })}
            </ul>
        </div>
    )
}
