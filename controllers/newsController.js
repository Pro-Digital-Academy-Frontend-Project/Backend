const {getNews} = require('../services/newsService.js');

exports.getNews = async (req, res) => {
    try {
      res.json(getNews());
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  };