const express = require('express')
const router = express.Router()
const keywordController = require('../controllers/keywordController')

router.get('/stocks/:stock_id', keywordController.keywordRankingByStock);
router.get('/:keyword_id/stock-rankings', keywordController.stocksRankingByKeyword);
router.get('/total-rankings', keywordController.totalRanking)
router.get('/top-keyword', keywordController.topKeyword)
router.get('/:keyword', keywordController.searchByKeywordName)


module.exports = router
