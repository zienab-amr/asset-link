const express = require("express");
const router = express.Router();

const {
  generateContractPDF,
  downloadContractPDF,
  viewContractPDF,
} = require("../controllers/contract.controller");

router.get("/:id/pdf", generateContractPDF);

router.get("/:id/download", downloadContractPDF);

router.get("/:id/view", viewContractPDF);

module.exports = router;