const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { httpError, validateRegisterInput } = require("./validators");

async function register(payload) {
  validateRegisterInput(payload);
  const existing = await userModel.findByEmail(payload.email);
  if (existing) throw httpError(409, "Email is already in use");

  const hash = await bcrypt.hash(payload.password, 10);
  const created = await userModel.createUser({ ...payload, password: hash });
  const user = await userModel.findById(created.id);
  return user;
}

async function login({ email, password }) {
  if (!email || !password) throw httpError(400, "Email and password are required");
  const user = await userModel.findByEmail(email);
  if (!user) throw httpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw httpError(401, "Invalid credentials");

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

module.exports = { register, login };
