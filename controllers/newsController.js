const {getNews} = require('../services/newsService.js');

// GET 크롤링한 뉴스 정보 조회
exports.getNews = async (req, res) => {
    try {
      res.json(getNews());
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  };