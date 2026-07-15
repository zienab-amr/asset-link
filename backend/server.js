const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

require('dotenv').config();

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();