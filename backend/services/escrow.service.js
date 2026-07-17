const escrowModel = require("../models/escrow.model");
const bookingModel = require("../models/booking.model");
const disputeModel = require("../models/dispute.model");

const createEscrow = async (escrowData) => {
  const { bookingId, payerCompanyId, receiverCompanyId, amount } = escrowData;

  // Validation — required fields
  if (!bookingId) throw new Error("bookingId is required");
  if (!payerCompanyId) throw new Error("payerCompanyId is required");
  if (!receiverCompanyId) throw new Error("receiverCompanyId is required");
  if (amount === undefined || amount === null) throw new Error("amount is required");

  // Validation — booking must exist
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Validation — booking must be Confirmed before escrow can be created
  if (booking.status !== "Confirmed") {
    throw new Error("Invalid booking status. Escrow can only be created for Confirmed bookings");
  }

  // Validation — prevent duplicate escrow for the same booking
  const existingEscrow = await escrowModel.findOne({ bookingId });
  if (existingEscrow) {
    throw new Error("Invalid operation. Escrow already exists for this booking");
  }

  const newEscrow = new escrowModel({
    bookingId,
    payerCompanyId,
    receiverCompanyId,
    amount
  });

  await newEscrow.save();

  return newEscrow;
};

const getEscrowByBookingId = async (bookingId) => {
  const escrow = await escrowModel.findOne({ bookingId })
    .populate("bookingId")
    .populate("payerCompanyId")
    .populate("receiverCompanyId");

  if (!escrow) throw new Error("Escrow not found");

  return escrow;
};

const freezeMoney = async (escrowId) => {
  const escrow = await escrowModel.findById(escrowId);
  if (!escrow) throw new Error("Escrow not found");

  // Idempotent — if already Frozen, just return current state
  if (escrow.status === "Frozen") {
    return escrow;
  }

  escrow.status = "Frozen";
  await escrow.save();

  return escrow;
};

const releaseMoney = async (bookingId) => {
  // Validate booking exists
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Business Rule: ممنوع Release قبل انتهاء العقد
  if (booking.status !== "Completed") {
    throw new Error("Invalid operation. Cannot release money before booking is completed");
  }

  // Business Rule: لا يتم تحويل المبلغ إلا بعد حل أي نزاع مفتوح
  const openDispute = await disputeModel.findOne({ bookingId, status: "Open" });
  if (openDispute) {
    throw new Error("Invalid operation. Cannot release money while an open dispute exists");
  }

  // Find escrow for this booking
  const escrow = await escrowModel.findOne({ bookingId });
  if (!escrow) throw new Error("Escrow not found");

  // Transition to Released
  escrow.status = "Released";
  await escrow.save();

  return escrow;
};

module.exports = {
  createEscrow,
  getEscrowByBookingId,
  freezeMoney,
  releaseMoney,
};
