// backend/models/user.js
const db = require("../config/db");

const User = {
  createUser: (name, color, callback) => {
    const sql = "INSERT INTO users (name, color) VALUES (?, ?)";
    db.query(sql, [name, color], callback);
  },
  getUserInstructions: (color, callback) => {
    const sql = "SELECT instructions FROM instructions WHERE color = ?";
    db.query(sql, [color], callback);
  },
};

module.exports = User;
