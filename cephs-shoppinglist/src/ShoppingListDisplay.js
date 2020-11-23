import React from "react";
import ShoppingList from "./ShoppingList";

class ShoppingListDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            searchValue: "",
            filteredList: [],
        };
    }

    async componentDidMount() {
        const res = await fetch(`http://localhost:3001/shoppinglist/1/items`);
        const json = await res.json();
        this.setState({ itemList: json, filteredList: json });
    }

    async componentDidUpdate() {
        const res = await fetch(`http://localhost:3001/shoppinglist/1/items`);
        const json = await res.json();
        this.setState({ itemList: json, filteredList: json });
    }

    handleOnChange = (e) => {
        this.setState({ searchValue: e.target.value });
        if (e.target.value.length === 0) {
            this.setState({ filteredList: this.state.itemList });
        } else {
            this.setState({
                filteredList: this.state.itemList.filter((item) =>
                    item.item_name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                ),
            });
        }
    };

    handleClear = () => {
        this.setState({ searchValue: "", filteredList: this.state.itemList });
    };

    handleDelete = (item) => {
        if (item > 0) {
            fetch("http://localhost:3001/shoppinglist/1/item?linkId=" + item, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "failed") {
                        alert(res.message);
                    }
                });
        }
    };

    handlePlus = (item) => {
        if (item > 0) {
            let reqBody = {
                linkID: item,
                change: 1,
            };

            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            };
            fetch("http://localhost:3001/shoppinglist/1/item", options)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "failed") {
                        alert(res.message);
                    }
                });
        }
    };

    handleMinus = (item) => {};

    handleCart = (item) => {};

    render() {
        return (
            <div>
                <div id="item-list-header">
                    <h2>Shopping List</h2>
                    <input
                        type="text"
                        className="search-box"
                        value={this.state.searchValue}
                        onChange={this.handleOnChange}
                    />
                    <br />
                    <button onClick={this.handleClear}>Reset</button>
                </div>
                <ShoppingList
                    items={this.state.filteredList}
                    minusButton={this.handleMinus}
                    plusButton={this.handlePlus}
                    cartButton={this.handleCart}
                />
            </div>
        );
    }
}

export default ShoppingListDisplay;
