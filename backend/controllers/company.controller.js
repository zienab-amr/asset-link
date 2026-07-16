const companyService = require("../services/company.service");

const getProfile = async (req, res) => {
console.log(req.company);
    try {

        const company = await companyService.getProfile(req.user.id);

        return res.status(200).json({
                    success: true,
                    data: company
                });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

const updateProfile = async (req, res) => {

    try {

        const company = await companyService.updateProfile(req.user.id, req.body);

        return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: company
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