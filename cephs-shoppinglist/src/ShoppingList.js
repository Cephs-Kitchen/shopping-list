import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

function ShoppingList(props) {
    const items = props.items;
    let category;
    let categoryLabel;
    const formattedList = items.map((item) => {
        if (category !== item.category_name) {
            category = item.category_name;
            categoryLabel = <h3 className="section-header">{category}</h3>;
        } else {
            categoryLabel = "";
        }
        return (
            <div id={item.link_id}>
                {categoryLabel}
                <p className="item-row">
                    <span
                        className="button-span"
                        onClick={() => props.plusButton(item.link_id)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                    {item.item_count}
                    <span
                        className="button-span"
                        onClick={() => props.minusButton(item.link_id)}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </span>
                    {item.item_name}
                    <span
                        className="button-span"
                        onClick={() => props.cartButton(item.link_id, item.item_id, item.item_count)}
                    >
                        <FontAwesomeIcon icon={faCartPlus} />
                    </span>
                </p>
            </div>
        );
    });

    return <div id="shopping-list-container">{formattedList}</div>;
}

export default ShoppingList;
