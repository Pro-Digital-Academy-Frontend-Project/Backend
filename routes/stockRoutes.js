const express = require('express')
const router = express.Router()
// const chartController = require('../controllers/chartController')
const chartController2 = require('../controllers/chartController2')
const searchController = require('../controllers/searchController')

// GET 특정 차트 데이터 조회
// router.get('/chart/:stock_code', chartController.getChart)
router.get('/chart/:stock_code/:chart_period', chartController2.getChart)
router.get('/name/:stock_name', searchController.searchStockByName)
router.get('/id/:stock_id', searchController.getStockById)
router.get('/top', searchController.getTopStock)

module.exports = router
