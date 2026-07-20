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
const negotiationRoutes = require('./controllers/negotiation.controller')
const contractRoutes = require("./routes/contract.routes");
const escrowRoutes = require("./routes/escrow.routes"); // Added by Eman
const rentalCompletionRoutes = require("./routes/rentalCompletion.routes");
const companyDashboardRoutes = require("./routes/companyDashboard.routes");
const disputeRoutes = require("./routes/dispute.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/asset", assetRouter);
app.use("/api/assetCategory", assetCategoryRouter);
app.use("/api/company", companyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/waiting-list", waitingListRoutes);
app.use("/api/negotiation", negotiationRoutes)
app.use("/api/contracts", contractRoutes);
app.use("/api/escrow", escrowRoutes); // Added by Eman
app.use("/api/rental-completion", rentalCompletionRoutes);
app.use("/api/company-dashboard", companyDashboardRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/payment", paymentRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

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
