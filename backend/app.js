require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const authRoutes = require("./routes/auth.routes");
const assetRouter = require("./routes/asset.routes");
const assetCategoryRouter = require("./routes/assetCategory.route");
const companyRoutes = require("./routes/company.routes");
const waitingListRoutes = require("./routes/waitingList.route");
const bookingRoutes = require("./routes/booking.routes");
const negotiationRoutes = require('./controllers/negotiation.controller');
const finalInspection = require("./routes/finalInspection.routes");
const damageReport= require("./routes/damageReport.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/asset", assetRouter);
app.use("/api/assetCategory", assetCategoryRouter);
app.use("/api/company", companyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use("/api/waiting-list", waitingListRoutes);
app.use("/api/negotiation", negotiationRoutes)
app.use("/api/final-inspection", finalInspection);
app.use("/api/damage-report", damageReport);

const startServer = async () => {
  try {
    await connectDB();
    // await connectRedis();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running successfully on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
