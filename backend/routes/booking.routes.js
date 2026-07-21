const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createBooking,
  getBooking,
  updateStatus,
} = require("../controllers/booking.controller");

router.post("/", authMiddleware, createBooking);
router.get("/:id", authMiddleware, getBooking);
router.patch("/:id/status", authMiddleware, updateStatus);

module.exports = router;