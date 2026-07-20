const mongoose = require("mongoose");

const damageReportSchema = new mongoose.Schema(
  {
    finalInspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinalInspection",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    damageLevel: {
      type: String,
      enum: ["minor", "moderate", "severe"],
      required: true,
    },
    damageCost: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DamageReport", damageReportSchema);