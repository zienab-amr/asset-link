const inspectorModel = require('../models/inspector.model');
const bookingModel = require('../models/booking.model');
const inspectionModel = require('../models/inspection.model');
const bcrypt = require('bcryptjs'); 


const addInspector = async (data, companyId) => {
  const { fullName, inspectorEmail, phoneNumber, password } = data;

  const existingInspector = await inspectorModel.findOne({ inspectorEmail });
  if (existingInspector) {
    throw new Error("This email is already registered for an inspector.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newInspector = await inspectorModel.create({
    companyId,
    fullName,
    inspectorEmail,
    phoneNumber,
    password: hashedPassword,
  });

  newInspector.password = undefined;

  return newInspector;
};


const getCompanyInspectors = async (companyId) => {
  const inspectors = await inspectorModel.find({ companyId }).select('-password');
  return inspectors;
};


const assignInspector = async (data) => {
  const {inspectorId, bookingId} = data;

  const booking = await bookingModel.findById(bookingId);
  if(!booking) throw new Error("This booking not found");

  if (booking.status !== "Confirmed") throw new Error("Cannot assign inspector. Booking must be Confirmed.");

  if(booking.assignedInspectorId) throw new Error("This booking already has an assigned inspector.");

  const inspector = await inspectorModel.findById(inspectorId);

  if(!inspector) throw new Error("This inpector not found");
  
  if(!inspector.isAvailable) throw new Error("Sorry, this inspector already is busy");

  booking.assignedInspectorId = inspectorId;
  inspector.isAvailable = false;

  await Promise.all([booking.save(), inspector.save()]);
  return booking;
}

const getMyTasks = async (inspectorId) => {
  
  const myTasks = await bookingModel.find({ assignedInspectorId: inspectorId })
    .populate('assetId')
    .populate('companyId');
    
  if(myTasks.length === 0) {
    return {
      success: true,
      message: "You don't have any pending tasks",
      data: []
    }
  }

  return {
    success: true,
    message: "Your tasks retrieved successfully",
    data: myTasks,
  }
}

const getInspectionHistory = async (assetId) => {
  const history = await inspectionModel.find({assetId});
  if(history.length === 0)
    return {
      success: true,
      message: "This asset don't have any inspections",
      data: []
  }

  return {
    success: true,
    message: "Your inspections retrieved successfully",
    data: history,
  }
}

module.exports = {
  addInspector, 
  getCompanyInspectors, 
  assignInspector, 
  getMyTasks, 
  getInspectionHistory
};