const keywordService = require('../services/keywordService');

exports.keywordRankingByStock = async (req, res) => {
    const {stockId} = req.param;

    try {
        const result = keywordService.getKeywordRankingByStock(stockId)
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}