// Express
const express = require("express");
const app = express();
const port = 3001;

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Database Connection
const Pool = require("pg").Pool;
const db = new Pool({
    user: "ceph",
    host: "localhost", //Update host as needed
    database: "cephs_citchen",
    password: "ceph",
    port: 5400, //Update port as needed
});

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

// GET shoppinglist details
app.get("/shoppinglist/:listId", (req, res) => {
    // db.query("SELECT tbl_shoppinglist.*, COUNT(link_id) As ItemCount FROM tbl_shoppinglist INNER JOIN tbl_shoppinglist_items ON tbl_shoppinglist.list_id = tbl_shoppinglist_items.list_id WHERE tbl_shoppinglist.list_id = $1 GROUP BY tbl_shoppinglist.list_id, tbl_shoppinglist_items.link_id", [req.params.listId], (db_err, db_res) => {
    db.query(
        "SELECT tbl_shoppinglist.* FROM tbl_shoppinglist WHERE tbl_shoppinglist.list_id = $1",
        [req.params.listId],
        (db_err, db_res) => {
            if (db_err) {
                throw db_err;
            }
            res.status(200).json(db_res.rows);
        }
    );
});

// GET shoppinglist with items
app.get("/shoppinglist/:listId/items", (req, res) => {
    db.query(
        "SELECT link_id, item_name, category_name, item_count FROM tbl_shoppinglist_items INNER JOIN tbl_items ON tbl_items.item_id = tbl_shoppinglist_items.item_id INNER JOIN tbl_item_categories ON tbl_item_categories.category_id = tbl_items.category_id WHERE list_id = $1",
        [req.params.listId],
        (db_err, db_res) => {
            if (db_err) {
                throw db_err;
            }
            res.status(200).json(db_res.rows);
        }
    );
});

// POST item to shoppinglist
app.post("/shoppinglist/:listId/item", (req, res) => {
    let result;
    const itemDetails = req.body;
    if (itemDetails.listID && itemDetails.itemID && itemDetails.itemCount) {
        db.query(
            "INSERT INTO tbl_shoppinglist_items (list_id, item_id, item_count) VALUES ($1, $2, $3)",
            [itemDetails.listID, itemDetails.itemID, itemDetails.itemCount],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                }
            }
        );
        result = {
            status: "success",
            message: "The item was successfully added to the shoppinglist",
        };
    } else {
        result = {
            status: "failed",
            message: "The item was not added to the shoppinglist",
        };
        res.status(400);
    }
    res.json(result);
});

// DELETE item from shoppinglist
app.delete("/shoppinglist/:listId/item", (req, res) => {
    let result;
    if (req.query.linkId) {
        db.query(
            "DELETE FROM tbl_shoppinglist_items WHERE link_id = $1",
            [req.query.linkId],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                }
            }
        );
        result = {
            status: "success",
            message: "The item was successfully removed to the shoppinglist",
        };
    } else {
        result = {
            status: "failed",
            message: "The item was not removed to the shoppinglist",
        };
        res.status(400);
    }
    res.json(result);
});

// POST item to pantry
app.post("/pantrylist/fromList", (req, res) => {
    let qryResult;
    const setValue = (value) => {
        qryResult = value;
    };

    let itemDetails = req.body;
    let result;
    if (itemDetails.itemID && itemDetails.itemCount) {
        db.query(
            "SELECT * FROM tbl_pantrylist WHERE item_id = $1",
            [itemDetails.itemID],
            (db_err, db_res) => {
                if (db_err) {
                    throw db_err;
                } else {
                    setValue(db_res.rows);

                    if (qryResult.length > 0) {
                        db.query(
                            "UPDATE tbl_pantrylist SET amount = $1 WHERE pantry_item_id = $2",
                            [
                                qryResult[0].amount + parseInt(itemDetails.itemCount),
                                qryResult[0].pantry_item_id,
                            ],
                            (db_err, db_res) => {
                                if (db_err) {
                                    throw db_err;
                                }
                            }
                        );
                        result = {
                            status: "success",
                            message: "The amount updated in Pantry.",
                        };
                        res.json(result);
                    } else {
                        db.query(
                            "INSERT INTO tbl_pantrylist (item_id, amount) VALUES ($1, $2)",
                            [itemDetails.itemID, itemDetails.itemCount],
                            (db_err, db_res) => {
                                if (db_err) {
                                    throw db_err;
                                }
                            }
                        );
                        result = {
                            status: "success",
                            message: "The item was added to the Pantry.",
                        };
                        res.json(result);
                    }
                }
            }
        );
    } else {
        result = {
            status: "failed",
            message: "Nothing was changed in the pantry.",
        };
        res.status(400);
        res.json(result);
    }
});

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);
