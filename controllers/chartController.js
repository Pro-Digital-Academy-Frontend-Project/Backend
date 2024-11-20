const axios = require('axios')

function getDateRange() {
  const today = new Date()
  const sixMonthsAgo = new Date(today)
  sixMonthsAgo.setMonth(today.getMonth() - 6)

  const formatDateTime = date =>
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0') +
    '0000'

  return {
    start: formatDateTime(sixMonthsAgo),
    end: formatDateTime(today),
  }
}

// 차트 데이터 조회
exports.getChart = async (req, res) => {
  const stock_code = req.params.stock_code

  try {
    const { start, end } = getDateRange()
    const baseUrl = `https://api.stock.naver.com/chart/domestic/item/${stock_code}/day?startDateTime=${start}&endDateTime=${end}`

    const resp = await axios.get(baseUrl, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        Referer: 'https://finance.naver.com/',
      },
    })

    console.log(resp.data)

    const data = resp.data
    if (!data) {
      return res.status(500).json({ error: '데이터 조회에 실패했습니다.' })
    }

    const stockData = data.map(item => ({
      date: `${item.localDate.slice(0, 4)}-${item.localDate.slice(4, 6)}-${item.localDate.slice(6, 8)}`,
      open: item.openPrice,
      high: item.highPrice,
      low: item.lowPrice,
      close: item.closePrice,
      volume: item.accumulatedTradingVolume,
    }))

    res.json(stockData)
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error)
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' })
  }
}
