const express = require("express");
const db = require("../database");
const Joi = require("joi");
const jwtAuthMiddleware = require("../jwtAuthMiddleware");

const router = express.Router();

// create a product
router.post("/create", jwtAuthMiddleware, (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().integer().required(),
    active: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  const { name, price, quantity, active } = req.body;

  // insert the product into the database
  db.run(
    "INSERT INTO products (name, price, quantity, active) VALUES (?, ?, ?, ?)",
    [name, price, quantity, active],
    function (err) {
      if (err) {
        return res.status(500).send({ message: "Error creating product." });
      }
      return res
        .status(201)
        .json({ id: this.lastID, message: "Product created successfully" });
    }
  );
});

// get all products
router.get("/getProducts", jwtAuthMiddleware, (req, res) => {
  db.all("SELECT * FROM products", function (err, rows) {
    if (err) {
      return res.status(500).send({ message: "Error fetching products." });
    }
    return res
      .status(201)
      .json({ rows, message: "Products list fetched successfully" });
  });
});

// get a product by id
router.get("/:id", jwtAuthMiddleware, (req, res) => {
  console.log(req.params.id, "-----req.params.id");
  const result = db.get(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    function (err, rows) {
      if (err) {
        return res.status(500).send({ message: "Error fetching product." });
      }
      console.log(rows, "---result data");
      return res
        .status(201)
        .json({ data: rows, message: "Product fetched successfully" });
    }
  );
});

// update a product
router.put("/:id", jwtAuthMiddleware, (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().integer().required(),
    active: Joi.boolean().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  const { name, price, quantity, active } = req.body;

  // update the product in the database
  db.run(
    "UPDATE products SET name = ?, price = ?, quantity = ?, active = ? WHERE id = ?",
    [name, price, quantity, active, req.params.id],
    function (err, row) {
      if (err) {
        return res.status(500).send({ message: "Error updating product." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json({ message: "Product updated successfully" });
    }
  );
});

// delete a product
router.delete("/:id", jwtAuthMiddleware, (req, res) => {
  db.run(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    function (err, row) {
      if (err) {
        return res.status(500).send({ message: "Error deleting product." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json({ row, message: "Product deleted successfully" });
    }
  );
});

module.exports = router;
