const axios = require('axios')

function getDateRange() {
  const today = new Date()
  const twelveMonthsAgo = new Date(today)
  twelveMonthsAgo.setMonth(today.getMonth() - 12)

  const formatDateTime = date =>
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')

  return {
    start: formatDateTime(twelveMonthsAgo),
    end: formatDateTime(today),
  }
}

exports.getChart = async (req, res) => {
  const { stock_code, chart_period } = req.params
  try {
    const { start, end } = getDateRange()
    const baseUrl = `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stock_code}&FID_INPUT_DATE_1=${start}&FID_INPUT_DATE_2=${end}&FID_PERIOD_DIV_CODE=${chart_period}&FID_ORG_ADJ_PRC=0`
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijg2NGRkMWEzLWQ5ZGYtNGM3My04N2EzLTM0OWExYjQyZGE0ZiIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTczMjY2MzI1NSwiaWF0IjoxNzMyNTc2ODU1LCJqdGkiOiJQU0lvaXVTUDAyNU40VkpRMzBzWm96eE5sS0hOaFFPV2RzNGEifQ.KIpBQHAhvVNVHPxBUVvgZOas3Fkrwk2SdBl_BtzM52xLYtbNB-d9m9opnQsddFOnnq2KLRer3sWgLZVUAHMv2A'

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      appkey: process.env.APP_KEY,
      appsecret: process.env.APP_SECRET,
      tr_id: 'FHKST03010100',
      custtype: 'P',
    }

    const resp = await axios.get(baseUrl, {
      headers: headers,
    })

    const data = resp.data
    if (!data) {
      return res.status(500).json({ error: '데이터 조회에 실패했습니다.' })
    }

    const stockData = data.output2
      .map(item => ({
        date: `${item.stck_bsop_date.slice(0, 4)}-${item.stck_bsop_date.slice(4, 6)}-${item.stck_bsop_date.slice(6, 8)}`,
        open: parseFloat(item.stck_oprc),
        high: parseFloat(item.stck_hgpr),
        low: parseFloat(item.stck_lwpr),
        close: parseFloat(item.stck_clpr),
        volume: parseInt(item.acml_vol),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json(stockData)
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error)
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' })
  }
}
