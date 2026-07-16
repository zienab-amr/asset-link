const assetService = require('../services/asset.service')

const addAsset = async (req, res) => {
  try{
    const newAsset = await assetService.addAsset(req.body)
    return res.status(201).send(newAsset);
    }
  catch(err){
    return res.status(500).send(err.message);
  }
}
const getAssets = async(req,res)=>{
  try{
    const assets = await assetService.getAssets()
    return res.status(200).send(assets);
  }catch(err){
    return res.status(500).send(err.message);
  }
}

const searchAssets = async (req,res)=>{
  try{
    const assets = await assetService.searchAssets(req.query)
    return res.status(200).send(assets);
  }catch(err){
    return res.status(500).send(err.message);
  }
}




module.exports = {addAsset,getAssets,searchAssets}