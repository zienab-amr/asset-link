const express = require("express");
const router = express.Router();

const {
  joinWaitingList,
  getWaitingListByAsset,
  removeFromWaitingList,
} = require("../controllers/waitingList.controller");

router.post("/", joinWaitingList);

router.get("/:assetId", getWaitingListByAsset);

router.delete("/:id", removeFromWaitingList);

module.exports = router;