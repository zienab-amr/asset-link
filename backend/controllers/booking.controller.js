const bookingService = require("../services/booking.service");

const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.createBooking(req.body);
    return res.status(201).send(newBooking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    return res.status(200).send(booking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
    return res.status(200).send(booking);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    if (err.message.includes("required") || err.message.includes("Invalid")) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { createBooking, getBooking, updateStatus };
