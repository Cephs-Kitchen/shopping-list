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
        const res = await fetch(`http://localhost:4001/shoppinglist/1/items`);
        const json = await res.json();
        this.setState({ itemList: json, filteredList: json });
    }

    async componentDidUpdate() {
        const res = await fetch(`http://localhost:4001/shoppinglist/1/items`);
        const json = await res.json();
        this.setState({ itemList: json });
    }

    handleOnChange = (e) => {
        this.setState({ searchValue: e.target.value });
        let newList = this.state.itemList;
        if (e.target.value.length > 0) {
            newList = newList.filter((item) =>
                item.item_name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            this.setState({
                filteredList: newList,
            });
        }
    };

    handleClear = () => {
        this.setState({ searchValue: "", filteredList: this.state.itemList });
    };

    handleDelete = (item) => {
        if (item > 0) {
            fetch("http://localhost:4001/shoppinglist/1/item?linkId=" + item, {
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
            fetch("http://localhost:4001/shoppinglist/1/update", options)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "failed") {
                        alert(res.message);
                    }
                });
        }
    };

    handleMinus = (item) => {
        if (item > 0) {
            let reqBody = {
                linkID: item,
                change: -1,
            };

            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            };
            fetch("http://localhost:4001/shoppinglist/1/update", options)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "failed") {
                        alert(res.message);
                    }
                });
        }
    };

    handleCart = (linkID, itemID, itemCount) => {
        console.log(linkID + " " + itemID + " " + itemCount);
        if (linkID && itemID && itemCount) {
            let reqBody = {
                itemID: itemID,
                itemCount: itemCount,
            };
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody),
            };
            fetch("http://localhost:4001/pantrylist/fromList", options)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status === "failed") {
                        alert(res.message);
                    }
                    fetch(
                        "http://localhost:4001/shoppinglist/1/item?linkId=" +
                            linkID,
                        { method: "DELETE" }
                    )
                        .then((res) => res.json())
                        .then((res) => {
                            if (res.status === "failed") {
                                alert(res.message);
                            } else {
                                alert(
                                    "Item added to pantry and removed from cart."
                                );
                            }
                        });
                });
        } else {
            alert("ERROR");
        }
    };

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
                        placeholder="Search"
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
