const escrowService = require("../services/escrow.service");

const createEscrow = async (req, res) => {
  try {
    const newEscrow = await escrowService.createEscrow(req.body);
    return res.status(201).send(newEscrow);
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

const getEscrowByBooking = async (req, res) => {
  try {
    const escrow = await escrowService.getEscrowByBookingId(req.params.bookingId);
    return res.status(200).send(escrow);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).send({ error: err.message });
    }
    return res.status(500).send({ error: err.message });
  }
};

const releaseMoney = async (req, res) => {
  try {
    const escrow = await escrowService.releaseMoney(req.params.bookingId);
    return res.status(200).send(escrow);
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

module.exports = { createEscrow, getEscrowByBooking, releaseMoney };
