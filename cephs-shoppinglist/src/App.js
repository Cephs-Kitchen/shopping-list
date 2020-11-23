import { Component } from 'react';
import './App.css';
import ItemDisplay from './ItemDisplay';
import ShoppingListDisplay from './ShoppingListDisplay';

class App extends Component {
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
                    <ShoppingListDisplay />
                </section>
            </main>
        );
    }
}

export default App