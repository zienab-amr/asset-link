const DamageReport = require("../models/damageReport.model");
const Booking = require("../models/booking.model");

const createDamageReport = async (data) => {
  const { finalInspection, booking, damageCost, damageLevel, description } = data;

  const damageReport = await DamageReport.create({
    finalInspection,
    booking,
    damageCost,
    damageLevel,
    description,
    status: "pending",
  });

  await Booking.findByIdAndUpdate(booking, {
    status: "pending_damage_resolution",
  });

  return damageReport;
};

const getDamageReportByBooking = async (bookingId) => {
  return await DamageReport.findOne({ booking: bookingId })
    .populate("finalInspection")
    .populate("booking");
};

const getAllDamageReports = async () => {
  return await DamageReport.find()
    .populate("booking")
    .populate("finalInspection");
};

const updateDamageReportStatus = async (id, status) => {
  return await DamageReport.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

module.exports = {
  createDamageReport,
  getDamageReportByBooking,
  getAllDamageReports,
  updateDamageReportStatus,
};