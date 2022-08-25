const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const user = require("./routes/user.js");
const auth = require("./routes/auth.js");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("LOG: CONNECTED TO DATABSE");
  })
  .catch((err) => {
    console.log(`ERROR: COULD NOT CONNECT TO DATABASE BECAUSE ${err}`);
  });

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/api/user", user);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LOG: SERVER STARTED ON PORT ${PORT}`);
});
