const waitingListModel = require("../models/waitingList.model");

const joinWaitingList = async (waitingData) => {
  const count = await waitingListModel.countDocuments({
    assetId: waitingData.assetId,
    status: "Waiting",
  });

  const waiting = await waitingListModel.create({
    ...waitingData,
    waitingCode: `WAIT-${Date.now()}`,
    position: count + 1,
  });

  return waiting;
};

const getWaitingListByAsset = async (assetId) => {
  const waitingList = await waitingListModel
    .find({
      assetId,
      status: "Waiting",
    })
    .populate("companyId")
    .sort({ position: 1 });

  return waitingList;
};

const removeFromWaitingList = async (id) => {
  const waiting = await waitingListModel.findById(id);

  if (!waiting) {
    throw new Error("Waiting list item not found");
  }

  await waitingListModel.findByIdAndDelete(id);

  return { message: "Removed successfully" };
};

const notifyFirstWaitingCompany = async (assetId) => {
  const waiting = await waitingListModel
    .findOne({
      assetId,
      status: "Waiting",
    })
    .sort({ position: 1 });

  if (!waiting) {
    return null;
  }

  waiting.status = "Notified";
  await waiting.save();

  return waiting;
};

module.exports = {
  joinWaitingList,
  getWaitingListByAsset,
  removeFromWaitingList,
  notifyFirstWaitingCompany,
};