const Company = require("../models/company.model");

const getProfile = async (companyId) => {

    const company = await Company.findById(companyId);

    if (!company) {
        throw {
            statusCode: 404,
            message: "Company not found"
        };
    }
    company.password = undefined;
    return company;
};

const updateProfile = async (companyId, data) => {

    const company = await Company.findById(companyId);

    if (!company) {
        throw {
            statusCode: 404,
            message: "Company not found"
        };
    }

    if (data.companyName)
        company.companyName = data.companyName;

    if (data.phoneNumber)
        company.phoneNumber = data.phoneNumber;

    if (data.location)
        company.location = data.location;

    if (data.companyLogo)
        company.companyLogo = data.companyLogo;

    await company.save();

    company.password = undefined;

    return company;
};

module.exports = {
    getProfile,
    updateProfile
};