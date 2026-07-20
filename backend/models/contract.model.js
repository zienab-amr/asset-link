const mongoose = require("mongoose");

// ============================================================
// TEMPORARY STUB - DO NOT COMMIT - by Eman
// This is a minimal local contract model so the escrow service
// can run while Person 2 finishes the real contract model.
// DELETE this file once the real contract model is merged.
// ============================================================
const contractSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending",
        "Active",
        "Approved",
        "Rejected",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contract", contractSchema);