const bcrypt = require('bcryptjs');
const Company = require('../models/company.model');
const generateOTP = require('../utils/otp.util');
const sendOTPEmail = require('../utils/sendEmail.util');
const { setCache, getCache, deleteCache } = require('../utils/cache.util');

/**
 * Register a new company
 * - Checks if email already exists in DB
 * - Checks if email already has a pending registration in Cache
 * - Hashes the password
 * - Generates OTP
 * - Stores everything in Redis Cache (TTL 5 min)
 * - Sends OTP via email (or console in dev)
 */
const registerCompany = async (data) => {
  const { companyName, companyEmail, phoneNumber, password, commercialRegistrationNumber, companyAddress } = data;

  // 1. Check if email already exists in DB
  const existingCompany = await Company.findOne({ companyEmail });
  if (existingCompany) {
    throw { statusCode: 409, message: 'Email is already registered' };
  }

  // 2. Check if there's already a pending registration in cache
  const pendingRegistration = await getCache(`register:${companyEmail}`);
  if (pendingRegistration) {
    throw { statusCode: 409, message: 'A registration is already pending for this email. Please verify OTP or wait for it to expire.' };
  }

  // 3. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Generate OTP
  const otp = generateOTP();

  // 5. Store in Redis Cache
  const cacheData = {
    companyName,
    companyEmail,
    phoneNumber,
    password: hashedPassword,
    commercialRegistrationNumber: commercialRegistrationNumber || null,
    companyAddress: companyAddress || null,
    otp,
  };

  await setCache(`register:${companyEmail}`, cacheData);

  // 6. Send OTP email
  await sendOTPEmail(companyEmail, otp);

  return { message: 'OTP sent successfully. Please check your email.' };
};

/**
 * Verify OTP and create company in database
 * - Gets cached data by email
 * - Compares OTP
 * - Creates company in DB with isVerified = true
 * - Deletes cache entry
 */
const verifyOtp = async (email, otp) => {
  // 1. Get cached data
  const cachedData = await getCache(`register:${email}`);
  if (!cachedData) {
    throw { statusCode: 400, message: 'OTP has expired or email not found. Please register again.' };
  }

  // 2. Compare OTP
  if (cachedData.otp !== otp) {
    throw { statusCode: 400, message: 'Invalid OTP code' };
  }

  // 3. Create company in database
  const company = await Company.create({
    companyName: cachedData.companyName,
    companyEmail: cachedData.companyEmail,
    phoneNumber: cachedData.phoneNumber,
    password: cachedData.password,
    commercialRegistrationNumber: cachedData.commercialRegistrationNumber,
    companyAddress: cachedData.companyAddress,
    isVerified: true,
  });

  // 4. Delete cached data
  await deleteCache(`register:${email}`);

  return {
    message: 'Company registered and verified successfully',
    company: {
      id: company._id,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      isVerified: company.isVerified,
    },
  };
};

/**
 * Resend OTP
 * - Checks if there's a pending registration in cache
 * - Generates a new OTP
 * - Updates cache with new OTP (resets TTL)
 * - Sends new OTP via email
 */
const resendOtp = async (email) => {
  // 1. Check if pending registration exists
  const cachedData = await getCache(`register:${email}`);
  if (!cachedData) {
    throw { statusCode: 400, message: 'No pending registration found. Please register first.' };
  }

  // 2. Generate new OTP
  const newOtp = generateOTP();

  // 3. Update cache with new OTP (resets TTL to 5 min)
  cachedData.otp = newOtp;
  await setCache(`register:${email}`, cachedData);

  // 4. Send new OTP
  await sendOTPEmail(email, newOtp);

  return { message: 'New OTP sent successfully. Please check your email.' };
};

module.exports = { registerCompany, verifyOtp, resendOtp };
