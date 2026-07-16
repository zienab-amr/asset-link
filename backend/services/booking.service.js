const mongoose = require("mongoose");
const bookingModel = require("../models/booking.model");
const assetModel = require("../models/asset.model");
const companyModel = require("../models/company.model");
const generateBookingCode = require("../utils/generateBookingCode");

const VALID_PRICE_TYPES = ["Daily", "Weekly", "Monthly"];
const VALID_STATUSES = ["Pending", "Confirmed", "Rejected", "Cancelled", "Completed"];

const createBooking = async (bookingData) => {
  const {
    assetId,
    companyId,
    ownerCompanyId,
    startDate,
    endDate,
    priceType,
    totalPrice,
    notes
  } = bookingData;

  // Validation — required fields
  if (!assetId) throw new Error("assetId is required");
  if (!companyId) throw new Error("companyId is required");
  if (!ownerCompanyId) throw new Error("ownerCompanyId is required");
  if (!startDate) throw new Error("startDate is required");
  if (!endDate) throw new Error("endDate is required");
  if (!priceType) throw new Error("priceType is required");
  if (totalPrice === undefined || totalPrice === null) throw new Error("totalPrice is required");

  // Validation — priceType enum
  if (!VALID_PRICE_TYPES.includes(priceType)) {
    throw new Error("Invalid priceType. Must be one of: Daily, Weekly, Monthly");
  }

  // Validation — DB lookups
  const checkAsset = await assetModel.findById(assetId);
  if (!checkAsset) throw new Error("Asset not found");

  const checkCompany = await companyModel.findById(companyId);
  if (!checkCompany) throw new Error("Company not found");

  // Generate booking code
  const bookingCode = await generateBookingCode();

  // Start transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create and save booking inside transaction
    const newBooking = new bookingModel({
      bookingCode,
      assetId,
      companyId,
      ownerCompanyId,
      startDate,
      endDate,
      priceType,
      totalPrice,
      notes
    });

    await newBooking.save({ session });

    // Update asset status to Booked inside the same transaction
    const updatedAsset = await assetModel.findByIdAndUpdate(
      assetId,
      { status: "Booked" },
      { new: true, runValidators: true, session }
    );

    if (!updatedAsset) {
      throw new Error("Failed to update asset status");
    }

    // Both operations succeeded — commit
    await session.commitTransaction();

    return newBooking;
  } catch (err) {
    // Any failure — rollback all database changes
    await session.abortTransaction();
    throw err;
  } finally {
    // Always close the session
    session.endSession();
  }
};

const getBookingById = async (id) => {
  const booking = await bookingModel.findById(id)
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  if (!booking) throw new Error("Booking not found");

  return booking;
};

const updateBookingStatus = async (id, statusData) => {
  const { status, cancelReason } = statusData;

  const booking = await bookingModel.findById(id);
  if (!booking) throw new Error("Booking not found");

  // Validation — status enum
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status. Must be one of: Pending, Confirmed, Rejected, Cancelled, Completed");
  }

  // If Cancelled, cancelReason is required
  if (status === "Cancelled" && !cancelReason) {
    throw new Error("cancelReason is required when status is Cancelled");
  }

  booking.status = status;

  if (status === "Cancelled") {
    booking.cancelReason = cancelReason;
  }

  await booking.save();

  return booking;
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingStatus,
};
