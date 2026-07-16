const assetModel = require("../models/asset.model");
const companyModel = require("../models/company.model");
const assetCategoryModel = require("../models/assetCategory.model");

const generateCode = async () => {
  const lastAsset = await assetModel.findOne().sort({ createdAt: -1 });

  if (!lastAsset) {
    return "AST-0001";
  }

  const lastCode = lastAsset.assetCode;
  const lastNumber = parseInt(lastCode.split("-")[1]);
  const newNumber = lastNumber + 1;
  const assetCode = `AST-${newNumber.toString().padStart(4, "0")}`;

  return assetCode;
};

const addAsset = async (assetData) => {
  const {
    companyId,
    assetCategoryId,
    assetName,
    assetImages,
    description,
    price,
    status,
    location,
  } = assetData;

  const checkCompany = await companyModel.findById(companyId);
  if (!checkCompany) throw new Error("This Company not found");

  const checkCategory = await assetCategoryModel.findById(assetCategoryId);
  if (!checkCategory) throw new Error("This Category not found");

  if (!assetName) throw new Error("Name asset is required");
  if (!assetImages || assetImages.length === 0)
    throw new Error("Image of asset is required");
  if (!description) throw new Error("Description is required");
  if (!price || !price.daily)
    throw new Error("please add at least daily price");

  const assetCode = await generateCode();

  const newAsset = new assetModel({
    assetCode,
    companyId,
    assetCategoryId,
    assetName,
    assetImages,
    description,
    price,
    status,
    location,
  });

  await newAsset.save();

  return newAsset;
};

const getAssetDetails = async (id) => {
  const asset = await assetModel.findById(id);

  if (!asset) throw new Error("Asset not found");

  return asset;
};

const updateAsset = async (id, assetData) => {
  const asset = await assetModel.findById(id);

  if (!asset) throw new Error("Asset not found");

  const updatedAsset = await assetModel.findByIdAndUpdate(id, assetData, {
    new: true,
  });

  return updatedAsset;
};

module.exports = { addAsset }