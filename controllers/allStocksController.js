const Stock = require('../models/Stock');

exports.getStocks = async (req, res) => {
    try {
      const stocks = await Stock.findAll();
      res.json(stocks);
    } catch (error) {
        console.error('주식 종목 조회 중 오류 발생:', error);
        res.status(500).json({ error: '주식 종목 조회 중 오류가 발생했습니다.' });
    }
  };