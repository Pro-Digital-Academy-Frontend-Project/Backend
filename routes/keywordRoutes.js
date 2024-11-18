const express = require('express')
const router = express.Router()
const keywordController = require('../controllers/keywordController')

router.get('/stocks/:stock_id', keywordController.getTopKeywords);

module.exports = router
