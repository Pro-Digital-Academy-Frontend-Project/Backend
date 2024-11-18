const Stock = require('../models/Stock')
const Keyword = require('../models/Keyword')

exports.getKeywordRankingByStock = async (stockId) => {
    try {
        const keywords = await Keyword.findAll({
            where: {
                stock_id: stockId,
            },
            order: [
                ['weight', 'DESC'],  // weight 값을 기준으로 내림차순 정렬
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
            stock_name: keywords[0]?.Stock?.stock_name,
            keyword_rankings: keywords.map(keyword => ({
                keyword: keyword.keyword,
                weight: keyword.weight,
            }))
        };
    } catch (err) {
        throw new Error(err)
    }
}