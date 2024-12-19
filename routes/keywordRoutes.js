const express = require('express')
const router = express.Router()
const keywordController = require('../controllers/keywordController')

router.get('/stocks/:stock_id', keywordController.keywordRankingByStock);
router.get('/:keyword_id/stock-rankings', keywordController.stocksRankingByKeyword);

// router.get('/total-rankings', keywordController.totalRanking)
router.get('/total-rankings', keywordController.totalRankingByES)

// router.get('/top-keyword', keywordController.topKeyword)
router.get('/top-keyword', keywordController.topKeywordByES)

// router.get('/:keyword', keywordController.searchByKeywordName) // Like 연산자
router.get('/:keyword', keywordController.searchByKeywordNameByES) // ElasticSearch를 통한 검색

module.exports = router