const express = require('express')
const app = express();

const connectDB = require('./config/db');

const assetRouter = require('../backend/routes/asset.routes')
const assetCategoryRouter = require('../backend/routes/assetCategory.route')

app.use(express.json());
require('dotenv').config();

connectDB();

app.use('/asset', assetRouter);
app.use('/assetCategory', assetCategoryRouter);


app.listen(process.env.PORT, ()=>{
  console.log(`server in running on port ${process.env.PORT}`)
})






module.exports = app;