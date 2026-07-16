const express = require("express");

const router = express.Router();

const companyController = require("../controllers/company.controller");


router.get("/profile", companyController.getProfile);

router.put("/profile", companyController.updateProfile);

module.exports = router;