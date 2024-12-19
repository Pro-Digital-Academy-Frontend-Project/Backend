const keywordService = require('../services/keywordService');
const elasticSearchService = require('../services/elasticSearchService');
const { client } = require('../elasticSearch');

exports.keywordRankingByStock = async (req, res) => {
    const { stock_id } = req.params;

    try {
        const result = await keywordService.getKeywordRankingByStock(stock_id)
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.stocksRankingByKeyword = async (req, res) => {
    const { keyword_id } = req.params;

    try {
        const result = await keywordService.getStocksRankingByKeyword(keyword_id);
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.totalRankingByES = async (req, res) => {
    try {
        const result = await elasticSearchService.getTotalRankingByES();
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.totalRanking = async (req, res) => {
    try {
        const result = await keywordService.getTotalRanking();
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Like 연산자
// exports.searchByKeywordName = async (req, res) => {
//     const {keyword} = req.params

//     try {
//         const result = await keywordService.getSearchByKeyword(keyword);
//         res.json(result)
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
// }

// ElasticSearch
exports.searchByKeywordNameByES = async (req, res) => {
    const {keyword} = req.params

    try {
        const result = await elasticSearchService.searchKeywordsByES(keyword);
        res.json(result);
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// exports.topKeyword = async (req, res) => {
//     try {
//         const result = await keywordService.getTopKeyword();
//         res.json(result)
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

exports.topKeywordByES = async (req, res) => {
    try {
        const result = await elasticSearchService.topKeywordByES();
        res.json(result)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}