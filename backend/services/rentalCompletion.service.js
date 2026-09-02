const bookingModel = require("../models/booking.model");
const assetModel = require("../models/asset.model");
const contractModel = require("../models/contract.model");
const bookingService = require("./booking.service");
const escrowService = require("./escrow.service");
const damageReportService = require("./damageReport.service");

const inspectionModel = require("../models/inspection.model");

const makeError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const returnAsset = async (bookingId) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // Active rental state is "Confirmed"
  if (booking.status !== "Confirmed") {
    throw makeError("Invalid operation. Booking is not in an active rental state.", 400);
  }

  // NEW: prevent marking the asset as returned before the agreed rental
  // period has actually ended (i.e. before endDate).
  const now = new Date();
  const rentalEndDate = new Date(booking.endDate);

  if (now < rentalEndDate) {
    const remainingMs = rentalEndDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

    throw makeError(
      `Invalid operation. The rental period has not ended yet (${remainingDays} day(s) remaining, ends on ${rentalEndDate.toLocaleDateString()}).`,
      400
    );
  }

  // Mark the return event without changing the enum status
  booking.returnedAt = new Date();
  await booking.save();

  return booking;
};

const completeRental = async (bookingId) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) throw makeError("Booking not found", 404);

  // 1. Verify Final Inspection completion
  const finalInspection = await inspectionModel.findOne({ bookingId, inspectionType: "after_use" });
  if (!finalInspection || finalInspection.status !== "Passed") {
    throw makeError("Invalid operation. Final inspection must be completed/passed before closing the rental", 400);
  }

  // 2. Damage decision
  if (finalInspection.hasDamage) {
    const damageReport = await damageReportService.getDamageReportByBooking(bookingId);
    if (!damageReport || damageReport.status !== "resolved") {
      throw makeError("Cannot complete rental while there is unresolved damage. Please resolve penalties first.", 400);
    }
  }

  // 3. No damage (or damage resolved) — proceed with closing the rental
  const updatedBooking = await bookingService.updateBookingStatus(booking._id, { status: "Completed" });

  const updatedAsset = await assetModel.findByIdAndUpdate(
    booking.assetId,
    { status: "Available" },
    { new: true }
  );

  const updatedContract = await contractModel.findOneAndUpdate(
    { bookingId: booking._id },
    { status: "Completed" },
    { new: true }
  );

  // 4. Release rental amount to owner + refund remaining deposit to renter
  const releasedEscrow = await escrowService.releaseMoney(booking._id);

  return { booking: updatedBooking, asset: updatedAsset, contract: updatedContract, escrow: releasedEscrow };
};

module.exports = {
  returnAsset,
  completeRental
};