const companyService = require("../services/company.service");

const getProfile = async (req, res) => {
console.log(req.company);
    try {

        const company = await companyService.getProfile();

        return res.status(200).send(`Profile: ${company}`);

    } catch (error) {

        return res.status(500).send("error");

    }

};

const updateProfile = async (req, res) => {

    try {

        const company = await companyService.updateProfile(req.body);

        return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    company
});

    } catch (error) {

        return res.status(500).json({
        success: false,
        message: error.message
    })

    }

};

module.exports = {
    getProfile,
    updateProfile
};