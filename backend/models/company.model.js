const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required:[true, "Name Company is required"],
    minlength:2,
    trim:true
  },
  companyEmail: {
    type: String,
    required: [true, "Company Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required:true
  },
  password:{
    type:String,
    required:true,
    minlength: 8
  },
  companyLogo: {
    type:String
  },
  location:{
    type:String,
    required:true,
    trim: true
  },
  license:{
    type:String,
    required:true,
    unique: true,
    trim: true
  },
  role: {
  type: String,
  enum: ["Company", "Admin"],
  default: "Company"
  },
    
    isVerified:{
    type:Boolean,
    default:false
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("company", companySchema)