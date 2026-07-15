const express = require('express')
const app = express();

const connectDB = require('./config/db');

require('dotenv').config();

connectDB();

app.listen(process.env.PORT, (req,res)=>{
  console.log(`server in running on port ${process.env.PORT}`)
})