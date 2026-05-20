const { run, get } = require("../config/db");

function createUser({ name, email, password }) {
  return run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
}

function findByEmail(email) {
  return get("SELECT * FROM users WHERE email = ?", [email]);
}

function findById(id) {
  return get("SELECT id, name, email FROM users WHERE id = ?", [id]);
}

module.exports = { createUser, findByEmail, findById };
