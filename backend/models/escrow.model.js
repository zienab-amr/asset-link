const mongoose = require("mongoose");

// Escrow schema - holds rental amount + security deposit after contract approval - by Eman
const escrowSchema = new mongoose.Schema(
{
    escrowCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    },

    // link to the booking - by Eman
    bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: true,
    },

    // link to the contract (deposit is tied to the contract) - by Eman
    contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract",
    required: true,
    },

    // the renting company (the payer whose money is held) - by Eman
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
    },

    // the owner company (the beneficiary who will receive the money) - by Eman
    ownerCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
    },

    // Hold Rental Amount - by Eman
    rentalAmount: {
    type: Number,
    required: [true, "Rental amount is required"],
    min: 0,
    },

    // Hold Security Deposit - by Eman
    securityDeposit: {
    type: Number,
    required: [true, "Security deposit is required"],
    min: 0,
    },

    // full held amount = rental + deposit (held in full) - by Eman
    totalHeld: {
    type: Number,
    required: true,
    min: 0,
    },

    currency: {
    type: String,
    trim: true,
    default: "EGP",
    },

    // Escrow Status - by Eman
    status: {
    type: String,
    enum: ["Held", "Frozen", "Released", "Refunded", "Cancelled"],
    default: "Held",
    },

    // when the money was held - by Eman
    heldAt: {
    type: Date,
    default: Date.now,
    },

    // NEW: tracks whether the rental amount has been paid out to the owner company
    rentalReleased: {
        type: Boolean,
        default: false,
    },

    // NEW: timestamp of when the rental amount was released to the owner
    rentalReleasedAt: {
        type: Date,
    },

    // NEW: tracks whether the remaining security deposit has been refunded to the renter
    depositRefunded: {
        type: Boolean,
        default: false,
    },

    // NEW: timestamp of when the deposit was refunded to the renter
    depositRefundedAt: {
        type: Date,
    },

    // NEW: the deposit amount actually refunded (may be less than securityDeposit
    // if a penalty was deducted for damage), kept for a clear audit trail
    depositRefundedAmount: {
        type: Number,
        min: 0,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("escrow", escrowSchema);