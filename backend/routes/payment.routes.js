const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const requireIdempotency = require("../middlewares/idempotency.middleware");

router.post("/create", authMiddleware, requireIdempotency, paymentController.createPayment);

router.post("/webhook", paymentController.handleWebhook);

router.get("/:paymentId/status", authMiddleware, paymentController.getPaymentStatus);

router.get("/dashboard", authMiddleware, paymentController.getDashboard);

module.exports = router;