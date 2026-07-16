const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
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
  companyAddress:{
    type:String,
    trim: true
  },
  commercialRegistrationNumber:{
    type:String,
    unique: true,
    sparse: true,
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
//encrypt password before saving to database by Eman
companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("company", companySchema)