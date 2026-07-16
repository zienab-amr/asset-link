const express = require("express");
const router = express.Router();

const {addAsset,getAssets,searchAssets} = require('../controllers/asset.controller')

router.get("/getAssets", getAssets);
router.post('/addAsset', addAsset)
router.get("/search", searchAssets);


module.exports = router;
