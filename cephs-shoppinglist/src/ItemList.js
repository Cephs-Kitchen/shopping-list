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
                    <button onClick={props.handleOnClick}>+</button>
                </p>
            </div>
        );
    });

    return <div id="item-list-container">{formattedList}</div>;
}

export default ItemList;
