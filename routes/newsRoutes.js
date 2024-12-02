const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

/* GET 크롤링한 뉴스 정보 조회 */
router.get('/', newsController.getNews);

module.exports = router;