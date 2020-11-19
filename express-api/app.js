// Express
const express = require("express");
const app = express();
const port = 3001;

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Database Connection
import db from "./db";

// GET items  ---- /shoppinglist/items
app.get("/shoppinglist/items", (req, res) => {
        db.query('SELECT * FROM tbl_items', (db_err, db_res) => {
            if (db_err) {
                throw db_err;
            }
            res.status(200).json(db_res.rows);
        });
});

// GET item by id  ---- /shoppinglist/items?id=#
app.get("/shoppinglist/item", (req, res) => {
    if (req.query.id) {
        db.query('SELECT * FROM tbl_items WHERE item_id = $1', [req.query.id], (db_err, db_res) => {
            if (db_err) {
                throw db_err;
            }
            res.status(200).json(db_res.rows);
        });
    } else if (req.query.search) {
        let strSearch = '%' +  decodeURIComponent(req.query.search) + '%';
        db.query('SELECT * FROM tbl_items WHERE item_name LIKE ')
    }
});

// POST item to items
app.post("/shoppinglist/item", (req, res) => {

})



// GET shoppinglist

// POST item to shoppinglist

// DELETE item from shoppinglist

// DELETE item from shoppinglist

// POST item to pantry
