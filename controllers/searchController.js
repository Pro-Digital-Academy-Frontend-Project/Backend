const Stock = require('../models/Stock')
const { sequelize } = require('../models')
// 주식 종목 검색
exports.searchStockByName = async (req, res) => {
  const { stock_name } = req.params // 쿼리 파라미터에서 stock_name 가져오기
  try {
    const stocks = await Stock.findAll({
      attributes: ['id', 'code', 'stock_name', 'market'],
      where: {
        stock_name: {
          [require('sequelize').Op.like]: `%${stock_name}%`,
        },
      },
    })

    if (stocks.length === 0) {
      return res
        .status(404)
        .json({ message: '해당 이름의 주식 종목을 찾을 수 없습니다.' })
    }

    res.json(stocks)
  } catch (error) {
    console.error('주식 검색 중 오류 발생:', error)
    res.status(500).json({ error: '주식 검색 중 오류가 발생했습니다.' })
  }
}

exports.getStockById = async (req, res) => {
  const { stock_id } = req.params // 쿼리 파라미터에서 stock_name 가져오기

  try {
    const stocks = await Stock.findOne({
      attributes: ['id', 'code', 'stock_name', 'market'],
      where: {
        id: stock_id,
      },
    })

    if (stocks.length === 0) {
      return res
        .status(404)
        .json({ message: '해당 아이디의 주식 종목을 찾을 수 없습니다.' })
    }

    res.json(stocks)
  } catch (error) {
    console.error('주식 조회 중 오류 발생:', error)
    res.status(500).json({ error: '주식 조회 중 오류가 발생했습니다.' })
  }
}

exports.getTopStock = async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query(`
    SELECT 
        s.id AS stock_id,
        s.code AS stock_code,
        s.stock_name,
        SUM(k.weight) AS total_weight
    FROM 
        Stock s
    JOIN 
        Keyword k
    ON 
        s.id = k.stock_id
    GROUP BY 
        s.id, s.code, s.stock_name, s.market
    ORDER BY 
        total_weight DESC
    LIMIT 1;
`);

  if (results.length === 0) {
      return res.status(404).json({ message: 'No stocks found' });
  }

    res.json(results)
  } catch (error) {
    throw new Error(error)
  }
}