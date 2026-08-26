const express = require('express');
const router = express.Router();

const { 
  addInspector,          
  getCompanyInspectors,  
  assignInspector,
  getMyTasks, 
  getInspectionHistory 
} = require('../controllers/inspector.controller');

const authMiddleware = require("../middleware/auth.middleware"); 
const roleMiddleware = require("../middleware/role.middleware");

router.post('/add', authMiddleware, roleMiddleware('Company', 'Admin'), addInspector); 
router.get('/my-inspectors', authMiddleware, roleMiddleware('Company', 'Admin'), getCompanyInspectors); 
router.patch('/assign', authMiddleware, roleMiddleware('Company', 'Admin'), assignInspector); 


router.get('/tasks', authMiddleware, roleMiddleware('Inspector'), getMyTasks); 


router.get('/history/:assetId', authMiddleware, getInspectionHistory); 

module.exports = router;