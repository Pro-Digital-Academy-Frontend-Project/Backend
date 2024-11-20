const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// GET 특정 차트 데이터 조회
router.get('/stocks/chart',chartController.getData);

module.exports = router
