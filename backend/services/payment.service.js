const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Contract = require("../models/contract.model"); 
const paymentProvider = require("./paymentProvider.service");
const escrowService = require("./escrow.service");

const createPayment = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status !== "Confirmed") {
        throw new Error("Booking is not confirmed");
    }
    const existingPayment = await Payment.findOne({ bookingId });
    
    if (existingPayment) {
        throw new Error("Booking already paid");
    }

    const contractData = await Contract.findOne({ bookingId });
    if (!contractData) {
        throw new Error("Contract not found for this booking");
    }

    const totalToPay = contractData.totalPrice + contractData.securityDeposit;

    const payment = await Payment.create({
        bookingId: booking._id,
        companyId: booking.companyId,
        amount: totalToPay,
        paymentStatus: "Pending",
    });
    
    
    return payment;
}

const completePayment = async (bookingId) => {

    const payment = await Payment.findOne({ bookingId });

    if (!payment) {
        throw new Error("Payment not found");
    }

    const contract = await Contract.findOne({ bookingId });

    if (!contract) {
        throw new Error("Contract not found");
    }

    const completedPayment = await paymentProvider.processPayment(payment._id);

    const escrow = await escrowService.createEscrow({
        bookingId,
        contractId: contract._id
    });

    return {
        payment: completedPayment,
        escrow
    };
};

module.exports = { createPayment ,completePayment };
