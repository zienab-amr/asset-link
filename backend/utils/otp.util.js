/**
 * Generate a random 6-digit OTP code
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

module.exports = generateOTP;
