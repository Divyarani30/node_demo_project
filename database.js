const sqlite3 = require("sqlite3").verbose();

// open the database
let db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the database.");
});

// create the user table
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// create the products table
db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price FLOAT,
  quantity INTEGER,
  active BOOLEAN
)`);

module.exports = db;
