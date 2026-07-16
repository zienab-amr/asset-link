require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const assetRouter = require('./routes/asset.routes');
const assetCategoryRouter = require('./routes/assetCategory.route');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/asset', assetRouter);
app.use('/api/assetCategory', assetCategoryRouter);
app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running successfully on port ${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); 
  }
};

startServer();

module.exports = app;
