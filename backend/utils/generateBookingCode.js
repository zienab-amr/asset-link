const bookingModel = require("../models/booking.model");

const generateBookingCode = async () => {
  const lastBooking = await bookingModel.findOne().sort({ createdAt: -1 });

  if (!lastBooking) {
    return "BK-000001";
  }

  const lastCode = lastBooking.bookingCode;
  const lastNumber = parseInt(lastCode.split("-")[1]);
  const newNumber = lastNumber + 1;
  const bookingCode = `BK-${newNumber.toString().padStart(6, "0")}`;

  return bookingCode;
};

module.exports = generateBookingCode;
