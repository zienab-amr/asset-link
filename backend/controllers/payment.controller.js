const paymentService = require("../services/payment.service");

const createPayment = async (req, res) => {
    try {

        const { bookingId } = req.body

        const payment = await paymentService.createPayment(bookingId)

        res.status(201).send("payment created successfully")

    } catch (err) {

        res.status(400).send(err.message)

    }
};

module.exports = {createPayment}