import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function ItemList(props) {
    const items = props.items;
    let category;
    let categoryLabel;
    const formattedList = items.map((item) => {
        if (category !== item.category_name) {
            category = item.category_name;
            categoryLabel = <h3>{category}</h3>;
        } else {
            categoryLabel = "";
        }
        return (
            <div id={item.item_id}>
                {categoryLabel}
                <p>
                    {item.item_name}{" "}
                    <span className="button-span" onClick={() => props.handleOnClick(item.item_id)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </span>
                </p>
            </div>
        );
    });

    return <div id="item-list-container">{formattedList}</div>;
}

export default ItemList;
