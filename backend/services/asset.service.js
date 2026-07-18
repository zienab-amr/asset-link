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
}

const getAssets = async () => {
  const assets = await assetModel.find()
    .populate("companyId")
    .populate("assetCategoryId");
    
  return assets;
};


const searchAssets = async (query) => {

    let filter = {};

    if (query.name) {
        filter.assetName = {
            $regex: query.name,
            $options: "i"
        };
    }
  if (query.assetCode) {

    filter.assetCode = {
        $regex: query.assetCode,
        $options: "i"
    };

  }
  if (query.category) {
    filter.assetCategoryId = query.category;
}
if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
}

if (query.status) {
    filter.status = query.status;
}
if (query.priceType && (query.minPrice || query.maxPrice)) {

    const price = `price.${query.priceType}`;

    filter[price] = {};

    if (query.minPrice) {
        filter[price].$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
        filter[price].$lte = Number(query.maxPrice);
    }
}
    const assets = await assetModel.find(filter).populate("companyId",).populate("assetCategoryId");

    return assets;
};

const getAssetDetails = async (id) => {
  const asset = await assetModel.findById(id)
    .populate("companyId")
    .populate("assetCategoryId");
    
  if (!asset) throw new Error("Asset not found");
  
  return asset;
};

const updateAsset = async (id, updateData) => {
  const updatedAsset = await assetModel.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  );

  if (!updatedAsset) throw new Error("Asset not found");
  
  return updatedAsset;
};

module.exports = {
  addAsset,
  getAssetDetails,
  updateAsset,
  getAssets,
  searchAssets,
};
