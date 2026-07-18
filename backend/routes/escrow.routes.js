const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware"); // by Eman

const {
  createEscrow,
  getEscrow,
  getEscrowByContract,
  getEscrowByBooking,
  updateEscrowStatus,
} = require("../controllers/escrow.controller");

// IMPORTANT: static-prefixed routes (/contract, /booking) before /:id - by Eman
router.post("/", authMiddleware, createEscrow);
router.get("/contract/:contractId", authMiddleware, getEscrowByContract);
router.get("/booking/:bookingId", authMiddleware, getEscrowByBooking);
router.get("/:id", authMiddleware, getEscrow);
router.patch("/:id/status", authMiddleware, updateEscrowStatus);

module.exports = router;