// Express
const express = require("express");
const app = express();
const port = 3001;

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Database Connection
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'ceph',
    host: 'localhost', //Update host as needed
    database: 'cephs_citchen',
    password: 'ceph',
    port: 5400 //Update port as needed
})

app.get("", (req, res) => {
    res.send("Connected");
});

// GET items  ---- /shoppinglist/items
app.get("/items", (req, res) => {
    db.query("SELECT * FROM tbl_items", (db_err, db_res) => {
        if (db_err) {
            throw db_err;
        }
        res.status(200).json(db_res.rows);
    });
});

// GET item by id  ---- /shoppinglist/items?id=#
app.get("/item", (req, res) => {
    if (req.query.id) {
        db.query(
            "SELECT * FROM tbl_items WHERE item_id = $1",
            [req.query.id],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                }
                res.status(200).json(db_res.rows);
            }
        );
    } else if (req.query.search) {
        let strSearch = "%" + decodeURIComponent(req.query.search) + "%";
        db.query("SELECT * FROM tbl_items WHERE item_name LIKE ");
    }
});

// POST item to items
app.post("/item", (req, res) => {
    let result;
    const itemDetails = req.body;
    if (itemDetails.name && itemDetails.categoryID) {
        db.query(
            "INSERT INTO tbl_items (item_name, category_id) VALUES ($1, $2)",
            [itemDetails.name, itemDetails.categoryID],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                }
            }
        );
        result = {
            status: "success",
            message: "The message was successfully sent",
        };
    } else {
        result = {
            status: "failed",
            message: "The message was not sent",
        };
        res.status(400);
    }
    res.json(result);
});

// GET shoppinglist
app.get("/shoppinglist", (req, res) => {
    db.query("SELECT * FROM tbl_shoppinglist", (db_err, db_res) => {
        if (db_err) {
            throw db_err;
        }
        res.status(200).json(db_res.rows);
    });
});


// POST item to shoppinglist
app.post("/shoppinglist/item", (req, res) => {
    let result;
    const itemDetails = req.body;
    if (itemDetails.name && itemDetails.categoryID) {
        db.query(
            "INSERT INTO tbl_items (item_name, category_id) VALUES ($1, $2)",
            [itemDetails.name, itemDetails.categoryID],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                }
            }
        );
        result = {
            status: "success",
            message: "The item was successfully added",
        };
    } else {
        result = {
            status: "failed",
            message: "The item was not added",
        };
        res.status(400);
    }
    res.json(result);
});

// DELETE item from shoppinglist

// DELETE item from shoppinglist

// POST item to pantry

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))