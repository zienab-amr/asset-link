const express = require('express')
const router = express.Router()

const {addCategory, viewCategories} = require('../controllers/assetCategory.controller')

router.post('/addCategory', addCategory)
router.get('/viewCategories', viewCategories)

module.exports = router;
