const Company = require("../models/company.model");

const getProfile = async () => {

    const company = await Company.findOne();

    if (!company) {
        throw {
            statusCode: 404,
            message: "Company not found"
        };
    }

    return company;
};

const updateProfile = async ( data) => {

    const company = await Company.findOne();

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