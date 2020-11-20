import React from "react";
import ItemList from "./ItemList";

class ItemDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            searchValue: "",
            filteredList: [],
        };
    }

    async componentDidMount() {
        const res = await fetch(`http://localhost:3001/items`);
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

    render() {
        return (
            <div>
                <h2>Available Items</h2>
                <input
                    type="text"
                    value={this.state.searchValue}
                    onChange={this.handleOnChange}
                />
                <button onClick={this.handleClear}>Reset</button>
                <ItemList items={this.state.filteredList} />
            </div>
        );
    }
}

export default ItemDisplay;
