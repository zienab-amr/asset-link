const inspectorModel = require('../models/inspector.model');
const bookingModel = require('../models/booking.model');
const inspectionModel = require('../models/inspection.model');
const bcrypt = require('bcryptjs'); 

const addInspector = async (req, res) => {
  try {
    // 1. استخراج البيانات من الـ Request
    const { fullName, inspectorEmail, phoneNumber, password } = req.body;
    
    // 2. استخراج الـ ID بتاع الشركة من الـ Token (عن طريق الـ authMiddleware)
    // لاحظي: لو الـ middleware بتاعكم بيخزن الداتا في مكان تاني زي req.company._id، عدليها
    const companyId = req.user.id || req.user._id; 

    const existingInspector = await inspectorModel.findOne({ inspectorEmail });
    if (existingInspector) {
      return res.status(400).json({ message: "This email is already registered for an inspector." });
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

    // 3. الرد على الفرونت إند بالنجاح
    return res.status(201).json({ success: true, data: newInspector, message: "Inspector added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getCompanyInspectors = async (req, res) => {
  try {
    const companyId = req.user.id || req.user._id;
    const inspectors = await inspectorModel.find({ companyId }).select('-password');
    return res.status(200).json({ success: true, data: inspectors });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const assignInspector = async (req, res) => {
  try {
    const { inspectorId, bookingId } = req.body;

    const booking = await bookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "This booking not found" });
    if (booking.status !== "Confirmed") return res.status(400).json({ message: "Cannot assign inspector. Booking must be Confirmed." });
    if (booking.assignedInspectorId) return res.status(400).json({ message: "This booking already has an assigned inspector." });

    const inspector = await inspectorModel.findById(inspectorId);
    if (!inspector) return res.status(404).json({ message: "This inpector not found" });
    if (!inspector.isAvailable) return res.status(400).json({ message: "Sorry, this inspector already is busy" });

    booking.assignedInspectorId = inspectorId;
    inspector.isAvailable = false;

    await Promise.all([booking.save(), inspector.save()]);
    return res.status(200).json({ success: true, data: booking, message: "Inspector assigned successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getMyTasks = async (req, res) => {
  try {
    const inspectorId = req.user.id || req.user._id;
    const myTasks = await bookingModel.find({ assignedInspectorId: inspectorId })
      .populate('assetId')
      .populate('companyId');
      
    if(myTasks.length === 0) {
      return res.status(200).json({ success: true, message: "You don't have any pending tasks", data: [] });
    }

    return res.status(200).json({ success: true, message: "Your tasks retrieved successfully", data: myTasks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getInspectionHistory = async (req, res) => {
  try {
    const assetId = req.params.assetId;
    const history = await inspectionModel.find({ assetId });
    
    if(history.length === 0) {
      return res.status(200).json({ success: true, message: "This asset don't have any inspections", data: [] });
    }

    return res.status(200).json({ success: true, message: "Your inspections retrieved successfully", data: history });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addInspector, 
  getCompanyInspectors, 
  assignInspector, 
  getMyTasks, 
  getInspectionHistory
};