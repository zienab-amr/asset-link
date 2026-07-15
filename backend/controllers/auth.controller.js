const authService = require('../services/auth.service');

/**
 * Register Company Controller
 * POST /api/auth/register-company
 */
const registerCompany = async (req, res) => {
  try {
    const { companyName, companyEmail, phoneNumber, password, confirmPassword, commercialRegistrationNumber, companyAddress } = req.body;

    // --- Input Validation ---

    // Required fields check
    if (!companyName || !companyEmail || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided (companyName, companyEmail, phoneNumber, password, confirmPassword)',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      });
    }

    // Phone format validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format (10-15 digits required)',
      });
    }

    // --- Call Service ---
    const result = await authService.registerCompany({
      companyName,
      companyEmail: companyEmail.toLowerCase(),
      phoneNumber,
      password,
      commercialRegistrationNumber,
      companyAddress,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * Verify OTP Controller
 * POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // --- Input Validation ---
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    // OTP format: 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be exactly 6 digits',
      });
    }

    // --- Call Service ---
    const result = await authService.verifyOtp(email.toLowerCase(), otp);

    return res.status(201).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * Resend OTP Controller
 * POST /api/auth/resend-otp
 */
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // --- Input Validation ---
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // --- Call Service ---
    const result = await authService.resendOtp(email.toLowerCase());

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

module.exports = { registerCompany, verifyOtp, resendOtp };
