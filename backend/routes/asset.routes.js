const express = require("express");
const router = express.Router();

const {
  addAsset,
  getAssetDetails,
  updateAsset,
  getAssets,
  searchAssets
} = require("../controllers/asset.controller");

router.post("/", addAsset);
router.get("/", getAssets)
router.get("/search", searchAssets);
router.get("/:id", getAssetDetails);
router.put("/:id", updateAsset);

module.exports = router;
