const axios = require('axios')
const { getToken } = require('../services/tokenService')

const cache = new Map()

function getDateRange() {
  const today = new Date()
  const twelveMonthsAgo = new Date(today)
  twelveMonthsAgo.setMonth(today.getMonth() - 36)

  const formatDateTime = date =>
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')

  return {
    start: formatDateTime(twelveMonthsAgo),
    end: formatDateTime(today),
  }
}

// exports.getChart = async (req, res) => {
//   const { stock_code, chart_period } = req.params  
//   try {
//     const { start, end } = getDateRange()
//     const baseUrl = `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stock_code}&FID_INPUT_DATE_1=${start}&FID_INPUT_DATE_2=${end}&FID_PERIOD_DIV_CODE=${chart_period}&FID_ORG_ADJ_PRC=0`
//     const token = getToken()

//     const headers = {
//       'Content-Type': 'application/json; charset=utf-8',
//       Authorization: `Bearer ${token}`,
//       appkey: process.env.APP_KEY,
//       appsecret: process.env.APP_SECRET,
//       tr_id: 'FHKST03010100',
//       custtype: 'P',
//     }

//     const resp = await axios.get(baseUrl, {
//       headers: headers,
//     })

//     const data = resp.data
//     if (!data) {
//       return res.status(500).json({ error: '데이터 조회에 실패했습니다.' })
//     }

//     const stockData = data.output2
//       .map(item => ({
//         date: `${item.stck_bsop_date.slice(0, 4)}-${item.stck_bsop_date.slice(4, 6)}-${item.stck_bsop_date.slice(6, 8)}`,
//         open: parseFloat(item.stck_oprc),
//         high: parseFloat(item.stck_hgpr),
//         low: parseFloat(item.stck_lwpr),
//         close: parseFloat(item.stck_clpr),
//         volume: parseInt(item.acml_vol),
//       }))
//       .sort((a, b) => new Date(a.date) - new Date(b.date))

//     res.json(stockData)
//   } catch (error) {
//     console.error('API 호출 중 오류 발생:', error)
//     res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' })
//   }
// }

// 캐싱 + 백오프 알고리즘 (딜레이를 늘려가며 재시도) But, 해당 코드에서는 딜레이를 늘려가며 시도하지는 않음.
exports.getChart = async (req, res) => {
  const { stock_code, chart_period } = req.params;

  // 캐시 키 생성
  const cacheKey = `${stock_code}_${chart_period}`;

  // 백오프 로직 (재시도 함수)
  const fetchWithRetry = async (attempts, delay) => {
    try {
      const { start, end } = getDateRange();
      const baseUrl = `https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${stock_code}&FID_INPUT_DATE_1=${start}&FID_INPUT_DATE_2=${end}&FID_PERIOD_DIV_CODE=${chart_period}&FID_ORG_ADJ_PRC=0`;

      const token = getToken();

      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
        appkey: process.env.APP_KEY,
        appsecret: process.env.APP_SECRET,
        tr_id: 'FHKST03010100',
        custtype: 'P',
      };

      const resp = await axios.get(baseUrl, { headers });

      // 데이터 파싱
      const data = resp.data;
      if (!data) throw new Error('데이터 조회 실패');

      const stockData = data.output2
        .map(item => ({
          date: `${item.stck_bsop_date.slice(0, 4)}-${item.stck_bsop_date.slice(4, 6)}-${item.stck_bsop_date.slice(6, 8)}`,
          open: parseFloat(item.stck_oprc),
          high: parseFloat(item.stck_hgpr),
          low: parseFloat(item.stck_lwpr),
          close: parseFloat(item.stck_clpr),
          volume: parseInt(item.acml_vol),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // 데이터 캐싱
      cache.set(cacheKey, stockData);
      setTimeout(() => cache.delete(cacheKey), 30 * 60 * 1000); // 30분 후 캐시 삭제

      console.log('API 데이터 반환 및 캐싱');
      return stockData;
    } catch (error) {
      if (attempts > 1) {
        console.log(`API 호출 실패. 재시도 중... 남은 횟수: ${attempts - 1}`);
        await new Promise(resolve => setTimeout(resolve, delay)); // 지연
        return fetchWithRetry(attempts - 1, delay * 2); // 지연 시간 증가
      } else {
        console.error('API 호출 실패: 최대 재시도 횟수 초과');
        throw error; // 최종 실패
      }
    }
  };

  // 캐시 확인
  if (cache.has(cacheKey)) {
    console.log('캐시된 데이터 반환');
    console.log("cacheData => ", cache.size)
    return res.json(cache.get(cacheKey)); // 캐싱된 데이터 반환
  }

  // API 호출 (백오프 적용)
  try {
    const stockData = await fetchWithRetry(5, 1000); // 최대 5번 재시도, 초기 지연 1초
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' });
  }
};