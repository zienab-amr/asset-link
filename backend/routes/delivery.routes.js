const express = require("express");

const router = express.Router();

const {
  createDelivery,
  getDelivery,
  updateDeliveryStatus,
  getDeliveryTimeline,
  getDeliveryHistory,
} = require("../controllers/delivery.controller");

router.post("/", createDelivery);

router.get("/history", getDeliveryHistory);

router.get("/:id", getDelivery);

router.patch("/:id/status", updateDeliveryStatus);

router.get("/:id/timeline", getDeliveryTimeline);

module.exports = router;
