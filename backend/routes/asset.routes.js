const express = require("express");
const router = express.Router();

const {
  addAsset,
  getAssetDetails,
  updateAsset,
} = require("../controllers/asset.controller");
router.post("/addAsset", addAsset);
router.get("/:id", getAssetDetails);

router.put("/:id", updateAsset);
module.exports = router;
