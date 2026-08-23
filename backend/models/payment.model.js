const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
        required: true,
        unique: true
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    // -------- Paymob tracking fields --------
    merchantOrderId: {
        type: String,
        unique: true,
        sparse: true
    },

    paymobOrderId: {
        type: String,
        index: true
    },

    paymentKey: {
        type: String
    },

    transactionId: {
        type: String
    },
    // -----------------------------------------

    paymentMethod: {
        type: String,
        enum: ["Paymob", "Cash"],
        default: "Paymob"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    paidAt: Date,
    refundedAt: Date

}, {
    timestamps: true
});

module.exports = mongoose.model("payment", paymentSchema);