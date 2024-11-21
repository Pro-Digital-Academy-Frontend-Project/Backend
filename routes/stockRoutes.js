const express = require('express')
const router = express.Router()
const chartController = require('../controllers/chartController')
const searchController = require('../controllers/searchController')

// GET 특정 차트 데이터 조회
router.get('/chart/:stock_code', chartController.getChart)
router.get('/chart', searchController.searchStockByName);

module.exports = router
