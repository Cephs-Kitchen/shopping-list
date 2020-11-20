import { Component } from 'react';
import './App.css';
import ItemDisplay from './ItemDisplay';

class ShoppingList extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render() {
        return(
            <main id="app-internal-container">
                <section id="item-container">
                    <ItemDisplay />
                </section>
                <section id="shoppinglist-container">
                    <h2>Shopping List</h2>
                </section>
            </main>
        );
    }
}

export default ShoppingList