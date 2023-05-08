const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database");

const router = express.Router();

// user registration

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // check if the user already exists
  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, row) => {
      if (err) {
        return res.status(500).send({ message: "Error registering user." });
      }
      if (row) {
        // user with the same username already exists
        return res.status(400).send({ message: "Username already taken." });
      }
      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert the user into the database
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).send({ message: "Error registering user." });
          }
          return res
            .status(200)
            .send({ message: "User registered successfully." });
        }
      );
    }
  );
});

// user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // find the user in the database
  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async function (err, user) {
      if (err) {
        return res.status(500).send({ message: "Error finding user." });
      }
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .send({ message: "Invalid username or password." });
      }

      // create a JWT token
      const token = jwt.sign({ id: user.id }, "secret");

      return res.status(200).send({ token });
    }
  );
});

module.exports = router;
