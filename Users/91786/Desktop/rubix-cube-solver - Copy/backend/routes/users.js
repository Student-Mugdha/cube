// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/solve", (req, res) => {
  const { name, color } = req.body;
  User.createUser(name, color, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    User.getUserInstructions(color, (err, instructions) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ instructions });
    });
  });
});

module.exports = router;
