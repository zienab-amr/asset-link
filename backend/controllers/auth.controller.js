const bcrypt = require('bcrypt');
const Company = require('../models/company.model');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
    try {
    const { companyEmail, password } = req.body;

    if (!companyEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    //find the company by email
    const company = await Company.findOne({ companyEmail });
    if (!company) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    //check if the company is verified
    if (!company.isVerified) {
        return res.status(403).json({ message: 'Your account is not verified yet' });
    }
    //check if the password matches
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    //generate token using the generateToken utility function
    const token = generateToken(company._id, company.role);

    //return the token and company details in the response
    res.status(200).json({
        message: 'Login successful',
        token,
        company: {
        id: company._id,
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        role: company.role
        }
    });

    } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    }
};