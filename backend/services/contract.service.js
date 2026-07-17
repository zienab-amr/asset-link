const contractModel = require("../models/contract.model");

const getAllContracts = async () => {
  const contracts = await contractModel
    .find()
    .populate("bookingId")
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  return contracts;
};

const getContractById = async (id) => {
  const contract = await contractModel
    .findById(id)
    .populate("bookingId")
    .populate("assetId")
    .populate("companyId")
    .populate("ownerCompanyId");

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
};

const approveContract = async (id, userId) => {
  const contract = await contractModel.findById(id);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.ownerCompanyId.toString() !== userId.toString()) {
    throw new Error("Only owner company can approve this contract");
  }

  if (contract.status !== "Draft") {
    throw new Error("Only draft contracts can be approved");
  }

  contract.status = "Active";
  contract.approvedAt = new Date();

  await contract.save();

  return contract;
};

const rejectContract = async (id, userId) => {
  const contract = await contractModel.findById(id);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.ownerCompanyId.toString() !== userId.toString()) {
    throw new Error("Only owner company can reject this contract");
  }

  if (contract.status !== "Draft") {
    throw new Error("Only draft contracts can be rejected");
  }

  contract.status = "Rejected";
  contract.rejectedAt = new Date();

  await contract.save();

  return contract;
};

module.exports = {
  getAllContracts,
  getContractById,
  approveContract,
  rejectContract,
};
