const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBooking,
  updateStatus,
} = require("../controllers/booking.controller");

router.post("/", createBooking);
router.get("/:id", getBooking);
router.patch("/:id/status", updateStatus);

module.exports = router;
