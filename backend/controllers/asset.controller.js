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
module.exports = {addAsset}