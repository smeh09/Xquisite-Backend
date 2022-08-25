const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express.Router();

app.post("/", async (req, res) => {
  const data = req.body;

  let user = await User.findOne({ email: data.email });
  if (!user) {
    res.status(400).send({ success: false, msg: "Invalid email or password" });
    return;
  }

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    res.status(400).send({ success: false, msg: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ _id: user.id }, process.env.JWT_PRIVATE_KEY);
  res.send({ success: true, token });
});

app.get("/isSignedIn", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(400).send({ success: false, msg: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    res.send({ success: true });
  } catch (err) {
    res.status(400).send({ success: false, msg: "Invalid token" });
    return;
  }
});

module.exports = app;
