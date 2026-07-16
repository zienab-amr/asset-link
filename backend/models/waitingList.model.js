const mongoose = require("mongoose");

const waitingListSchema = new mongoose.Schema(
  {
    waitingCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "asset",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
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
  }
);

module.exports = mongoose.model("WaitingList", waitingListSchema);