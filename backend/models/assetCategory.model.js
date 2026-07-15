const mongoose = require('mongoose')

const assetCategorySchema = new mongoose.Schema({
  assetCategoryName:{
    type: String,
    required:[true, "Name asset is required"],
    minlength:2,
    trim:true
  }
})

module.exports = mongoose.model("AssetCategory", assetCategorySchema)