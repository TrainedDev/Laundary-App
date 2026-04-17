const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', adminController.getDashboard);

module.exports = router;
