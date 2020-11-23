import React from "react";
import ItemList from "./ItemList";

class ItemDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            itemCategories: [],
            searchValue: "",
            searchCategory: 0,
            filteredList: [],
        };
    }

    async componentDidMount() {
        const resItems = await fetch(`http://localhost:3001/items`);
        const jsonItems = await resItems.json();
        const resCat = await fetch(`http://localhost:3001/categories`);
        const jsonCat = await resCat.json();
        this.setState({
            itemList: jsonItems,
            filteredList: jsonItems,
            itemCategories: jsonCat,
        });
    }
    
    async componentDidUpdate() {
        const resItems = await fetch(`http://localhost:3001/items`);
        const jsonItems = await resItems.json();
        const resCat = await fetch(`http://localhost:3001/categories`);
        const jsonCat = await resCat.json();
        this.setState({
            itemList: jsonItems,
            itemCategories: jsonCat,
        });
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
        }
        if (this.state.searchCategory > 0) {
            newList = newList.filter(
                (item) => item.category_id == this.state.searchCategory
            );
        }
        this.setState({ filteredList: newList });
    };

    handleSelectChange = (e) => {
        this.setState({ searchCategory: e.target.value });
        let newList = this.state.itemList;
        if (this.state.searchValue > 0) {
            newList = newList.filter((item) =>
                item.item_name
                    .toLowerCase()
                    .includes(this.state.searchValue.toLowerCase())
            );
        }
        if (e.target.value > 0) {
            newList = newList.filter(
                (item) => item.category_id == e.target.value
            );
        }
        this.setState({ filteredList: newList });
    };

    handleClear = () => {
        this.setState({ searchValue: "", filteredList: this.state.itemList });
    };

    async handleAdd() {
        let searchValue = this.state.searchValue;
        if (searchValue.length === 0) {
            alert("Must enter an item name");
            return;
        }
        let categoryID = this.state.searchCategory;
        if (categoryID == 0) {
            alert("Select a category");
            return;
        }
        let itemBody = {
            name: searchValue,
            categoryID: categoryID,
        };
        const options1 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemBody),
        };
        const resItems = await fetch("http://localhost:3001/item", options1);
        const jsonItems = await resItems.json();
        console.log(jsonItems);
        let listBody = {
            listID: 1,
            itemID: jsonItems[0].item_id,
            itemCount: 1,
        };
        console.log(listBody);
        const options2 = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listBody),
        };
        const resList = await fetch(
            "http://localhost:3001/shoppinglist/1/item",
            options2
        );
        const jsonList = await resList.json();
        alert(jsonList.message);
    }

    addToShoppingList = (item) => {
        console.log(item);
        let itemBody = {
            listID: 1,
            itemID: item,
            itemCount: 1,
        };
        console.log(itemBody);
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemBody),
        };
        fetch("http://localhost:3001/shoppinglist/1/item", requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "failed") {
                    alert(res.message);
                }
            });
    };

    render() {
        let categoryOptions = this.state.itemCategories.map((category) => {
            return (
                <option value={category.category_id}>
                    {category.category_name}
                </option>
            );
        });
        let categorySelect = (
            <select onChange={this.handleSelectChange}>
                <option value="0">All</option>
                {categoryOptions}
            </select>
        );
        return (
            <div>
                <div id="item-list-header">
                    <h2>Available Items</h2>
                    <input
                        type="text"
                        className="search-box"
                        value={this.state.searchValue}
                        onChange={this.handleOnChange}
                    />
                    {categorySelect}
                    <br />
                    <button onClick={this.handleClear}>Reset</button>
                    <button onClick={this.handleAdd.bind(this)}>
                        Add Item to Shopping List
                    </button>
                </div>
                <ItemList items={this.state.filteredList} handleOnClick={this.addToShoppingList} />
            </div>
        );
    }
}

export default ItemDisplay;
