const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  addAsset,
  getAssetDetails,
  updateAsset,
  getAssets,
  searchAssets,
  getAssetAvailability

} = require("../controllers/asset.controller");

router.post("/", authMiddleware, addAsset);
router.get("/", getAssets);
router.get("/search", searchAssets);
router.get("/:id/availability", getAssetAvailability);
router.get("/:id", getAssetDetails);
router.put("/:id", authMiddleware, updateAsset);

module.exports = router;