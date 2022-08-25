const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const dotenv = require("dotenv");

dotenv.config();

const app = express.Router();

app.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send({
      success: false,
      msg: "Another user already registered with this email address",
    });

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY);

  res.send({ success: true, token });
});

module.exports = app;
