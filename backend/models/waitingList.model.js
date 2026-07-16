const mongoose = require("mongoose");

const waitingListSchema = new mongoose.Schema(
  {
    waitingCode: {
      type: String,
      unique: true,
    },

    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    requestedStartDate: {
      type: Date,
      required: true,
    },

    requestedEndDate: {
      type: Date,
      required: true,
    },

    position: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["Waiting", "Notified", "Expired", "Converted"],
      default: "Waiting",
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("WaitingList", waitingListSchema);
