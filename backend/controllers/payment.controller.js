const paymentService = require("../services/payment.service");
const paymentProvider = require("../services/paymentProvider.service");

const createPayment = async (req, res) => {
    try {
        const { bookingId, billingData } = req.body;

        if (!billingData) {
            return res.status(400).json({
                success: false,
                message: "billingData is required (first_name, last_name, email, phone_number)"
            });
        }

        const { payment, iframeUrl } = await paymentService.createPayment(bookingId, billingData);

        res.status(201).json({
            success: true,
            message: "Payment initiated successfully",
            data: {
                paymentId: payment._id,
                iframeUrl
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

const handleWebhook = async (req, res) => {
    try {
        const transactionObj = req.body.obj || req.body;
        const receivedHmac = req.query.hmac;

        const isValid = paymentProvider.verifyHmac(transactionObj, receivedHmac);

        if (!isValid) {
            console.error("Invalid Paymob HMAC signature - possible spoofed webhook");
            return res.status(401).json({ success: false, message: "Invalid signature" });
        }

        await paymentService.completePaymentFromWebhook(transactionObj);

        res.status(200).json({ success: true });
    } catch (err) {
        console.log("========== WEBHOOK ERROR ==========");
        console.log(err);
        console.log(err.stack);

        res.status(500).json({ success: false, message: err.message });
    }
};

const getPaymentStatus = async (req, res) => {
    try {
        const paymentStatus = await paymentService.getPaymentStatus(req.params.paymentId);
        res.status(200).json({ success: true, data: { paymentStatus } });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const dashboard = await paymentService.getDashboard(req.user.id);

        res.status(200).json({
            success: true,
            data: dashboard
        });

    } catch (err) {
        console.log("========== ERROR ==========");
        console.log(err);
        console.log(err.stack);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createPayment,
    handleWebhook,
    getPaymentStatus,
    getDashboard
};