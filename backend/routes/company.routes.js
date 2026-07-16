const express = require("express");

const router = express.Router();

const companyController = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/profile", authMiddleware, companyController.getProfile);
router.put("/profile", authMiddleware, companyController.updateProfile);

module.exports = router;