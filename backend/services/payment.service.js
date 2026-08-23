const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Contract = require("../models/contract.model");
const paymentProvider = require("./paymentProvider.service");
const escrowService = require("./escrow.service");
const Escrow = require("../models/escrow.model");

const createPayment = async (bookingId, billingData) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.status !== "Confirmed") {
        throw new Error("Booking is not confirmed");
    }
    const existingPayment = await Payment.findOne({ bookingId });

    if (existingPayment) {
        throw new Error("Booking already paid");
    }

    const contractData = await Contract.findOne({ bookingId });
    if (!contractData) {
        throw new Error("Contract not found for this booking");
    }

    const totalToPay = contractData.totalPrice + contractData.securityDeposit;

    const merchantOrderId = `${bookingId}-${Date.now()}`;

    const { paymobOrderId, paymentKey, iframeUrl } = await paymentProvider.initiatePaymobPayment({
        amount: totalToPay,
        merchantOrderId,
        billingData,
    });

    const payment = await Payment.create({
        bookingId: booking._id,
        companyId: booking.companyId,
        amount: totalToPay,
        merchantOrderId,
        paymobOrderId,
        paymentKey,
        paymentStatus: "Pending",
    });

    return { payment, iframeUrl };
};

const completePaymentFromWebhook = async (transactionObj) => {
    const paymobOrderId = String(
        transactionObj.order?.id ?? transactionObj["order.id"]
    );
    const success = transactionObj.success === true || transactionObj.success === "true";

    const payment = await Payment.findOne({ paymobOrderId });
    if (!payment) {
        console.warn(`Webhook: no payment found for paymobOrderId ${paymobOrderId}`);
        return null;
    }

    if (payment.paymentStatus === "Completed") {
        return { payment };
    }

    if (!success) {
        payment.paymentStatus = "Failed";
        await payment.save();
        return { payment };
    }

    payment.paymentStatus = "Completed";
    payment.paidAt = new Date();
    payment.transactionId = String(transactionObj.id);
    await payment.save();

    const contract = await Contract.findOne({ bookingId: payment.bookingId });
    if (!contract) {
        throw new Error("Contract not found");
    }

    const escrow = await escrowService.createEscrow({
        bookingId: payment.bookingId,
        contractId: contract._id
    });

    contract.status = "Approved";
    contract.approvedAt = new Date();
    await contract.save();

    return { payment, escrow };
};

const getPaymentStatus = async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new Error("Payment not found");
    }
    return payment.paymentStatus;
};

const getDashboard = async (companyId) => {

    const payments = await Payment.find({ companyId });
    const escrows = await Escrow.find({ $or: [{ companyId }, { ownerCompanyId: companyId }] });

    const totalProcessed = payments
        .filter(p => p.paymentStatus === "Completed")
        .reduce((sum, p) => sum + p.amount, 0);

    const currentlyInEscrow = escrows
        .filter(e => e.status === "Held" || e.status === "Frozen")
        .reduce((sum, e) => sum + e.totalHeld, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const releasedMTD = escrows
        .filter(e =>
            e.status === "Released" &&
            e.updatedAt.getMonth() === currentMonth &&
            e.updatedAt.getFullYear() === currentYear
        )
        .reduce((sum, e) => sum + e.totalHeld, 0);

    const platformFee = releasedMTD * 0.05;

    const ledger = await Escrow.find({ $or: [{ companyId: companyId }, { ownerCompanyId: companyId }] })
        .populate("companyId", "companyName")
        .populate("ownerCompanyId", "companyName")
        .populate("bookingId")
        .sort({ createdAt: -1 });

    const ledgerData = ledger.map(item => ({
        escrowId: item.escrowCode,

        booking:
            item.bookingId?.bookingCode ||
            item.bookingId?._id?.toString().slice(-6) ||
            "-",

        from:
            item.companyId?.companyName || "-",

        to:
            item.ownerCompanyId?.companyName || "-",

        total: item.totalHeld,

        held:
            item.status === "Held" || item.status === "Frozen"
                ? item.totalHeld
                : 0,

        released:
            item.status === "Released"
                ? item.totalHeld
                : 0,

        date: item.createdAt,

        status: item.status
    }));

    const timeline = ledger.map(item => {
        let title = "";
        let status = "";
        let color = "";

        switch (item.status) {
            case "Held":
                title = `Escrow ${item.escrowCode} created — ${item.totalHeld} ${item.currency} deposited`;
                status = "In Escrow";
                color = "bg-orange-400";
                break;

            case "Frozen":
                title = `Escrow ${item.escrowCode} frozen due to dispute`;
                status = "Frozen";
                color = "bg-blue-500";
                break;

            case "Released":
                title = `Funds released to ${item.ownerCompanyId?.companyName || "Owner Company"}`;
                status = "Released";
                color = "bg-emerald-500";
                break;

            case "Refunded":
                title = `Escrow refunded to renter`;
                status = "Refunded";
                color = "bg-purple-500";
                break;

            case "Cancelled":
                title = `Escrow cancelled`;
                status = "Cancelled";
                color = "bg-red-500";
                break;

            default:
                title = item.escrowCode;
                status = item.status;
                color = "bg-slate-400";
        }

        return {
            title,
            date: item.createdAt,
            status,
            color
        };
    });

    return {
        summary: {
            totalProcessed,
            currentlyInEscrow,
            releasedMTD,
            platformFee
        },
        ledger: ledgerData,
        timeline
    };
};

module.exports = { createPayment, completePaymentFromWebhook, getPaymentStatus, getDashboard };