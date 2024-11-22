const Stock = require('../models/Stock')

// 주식 종목 검색
exports.searchStockByName = async (req, res) => {
  const { stock_name } = req.query // 쿼리 파라미터에서 stock_name 가져오기

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
