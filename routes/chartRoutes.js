const express = require('express')
const router = express.Router()
const chartController = require('../controllers/chartController')

// GET 특정 차트 데이터 조회
router.get('/chart/:stock_code', chartController.getChart)

module.exports = router
