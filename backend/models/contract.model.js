const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    pdfPath: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Draft", "Approved"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contract", contractSchema);