const express = require("express");
const app = express();

require("dotenv").config();

console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI);

const connectDB = require("./config/db");

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});