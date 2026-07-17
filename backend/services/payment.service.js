const Payment = require("../models/payment.model")
const Booking = require("../models/booking.model")


const createPayment =async(bookingId)=>{
    const booking = await Booking.findById(bookingId)
    if(!booking){
        throw new Error("Booking not found")
    }
    if(booking.status !=="Confirmed"){
        throw new Error("Booking is not confirmed")
    }
    const existingPayment = await Payment.findOne({bookingId})
    
    if (existingPayment) {
        throw new Error("Booking already paid");
    }
    const payment = await Payment.create({
         bookingId: booking._id,
        companyId: booking.companyId,
        amount: booking.totalPrice,
        paymentStatus: "Pending",
        escrowStatus: "Held"
    })
    return payment
}
module.exports = {createPayment}