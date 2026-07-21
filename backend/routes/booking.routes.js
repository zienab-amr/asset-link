const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware"); // Added by Eman

const {
  createBooking,
  getBooking,
  updateStatus,
  getCompanyBookings, // Added by Eman
  getMyBookings,      // Added by Eman
  cancelBooking,      // Added by Eman
} = require("../controllers/booking.controller");

// ====== Booking history & cancellation - Added by Eman ======
// IMPORTANT: static routes (/company, /my) MUST come before /:id - by Eman
router.get("/company", authMiddleware, getCompanyBookings);
router.get("/my", authMiddleware, getMyBookings);

router.post("/", createBooking);
router.get("/:id", getBooking);
router.patch("/:id/status", updateStatus);

// cancel route - by Eman
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;