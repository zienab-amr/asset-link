const express = require('express')
const router = express.Router() 

const {addAsset} = require('../controllers/asset.controller')

router.post('/addAsset', addAsset)

module.exports = router;