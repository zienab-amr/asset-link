const mongoose = require("mongoose");

const escrowSchema = new mongoose.Schema({

  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "booking", required: true },

  payerCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },

  receiverCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },

  amount: {
    type: Number,
    required: [true, "Escrow amount is required"]
  },

  status: {
    type: String,
    enum: ["Held", "Released", "Refunded", "Frozen"],
    default: "Held"
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("escrow", escrowSchema);
