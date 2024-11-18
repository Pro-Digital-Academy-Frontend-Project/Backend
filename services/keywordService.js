const { sequelize, Stock, Keyword } = require('../models');
const { Sequelize } = require('sequelize')

exports.getKeywordRankingByStock = async (stockId) => {
    try {
        const keywords = await Keyword.findAll({
            where: {
                stock_id: Number(stockId),
            },
            order: [
                ['weight', 'DESC'],
            ],
            limit: 5,
            include: [
                {
                  model: Stock,  // Stock 모델을 포함시켜서 가져오기
                  attributes: ['stock_name'],  // stock_name만 가져오기
                }
            ]
        });

        return {
            stock_name: keywords[0]?.Stock?.dataValues?.stock_name,
            keyword_rankings: keywords.map(keyword => ({
                keyword: keyword.keyword,
                weight: keyword.weight,
            }))
        };
    } catch (err) {
        throw new Error(err)
    }
}

exports.getStocksRankingByKeyword = async (keyword_id) => {
    try {
        const keyword = await Keyword.findByPk(Number(keyword_id));


        const stocks = await Keyword.findAll({
            where: {
                keyword: keyword.keyword
            },
            include: [
                {
                    model: Stock,  
                    attributes: ['stock_name', 'code'], 
                }
            ],
            order: [['weight', 'DESC']], 
            limit: 5,
        })

        const stockRankings = stocks.map(stock => ({
            code: stock.Stock?.code,
            stock_name: stock.Stock?.stock_name,
        }));

        return {
            keyword: stocks[0]?.keyword,
            keyword_id,
            stock_rankings: stockRankings
        };
    } catch (err) {
        throw new Error(err)
    }
}

exports.getTotalRanking = async () => {
    try {
        const rankings = await sequelize.query(
            `SELECT keyword, SUM(weight) AS totalWeight
            FROM Keyword
            GROUP BY keyword
            ORDER BY totalWeight DESC
            LIMIT 10`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        return rankings.map(keyword => ({
            keyword: keyword.keyword,
            totalWeight: keyword.totalWeight
        }));
    } catch (err) {
        throw new Error(err);
    }
};