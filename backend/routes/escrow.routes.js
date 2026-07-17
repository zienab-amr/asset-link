const express = require("express");
const router = express.Router();

const {
  createEscrow,
  getEscrowByBooking,
  releaseMoney,
} = require("../controllers/escrow.controller");

router.post("/", createEscrow);
router.get("/booking/:bookingId", getEscrowByBooking);
router.patch("/:bookingId/release", releaseMoney);

module.exports = router;
