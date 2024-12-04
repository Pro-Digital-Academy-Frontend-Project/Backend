const { WebClient } = require('@slack/web-api')
const sequelize = require('../db') // sequelize 인스턴스 가져오기
require('dotenv').config()

const webClient = new WebClient(process.env.SLACK_API_TOKEN)

async function getSlackUsers() {
  try {
    const response = await webClient.users.list()
    if (response.ok) {
      return response.members.filter(
        member => !member.is_bot && member.profile?.email
      ) // 봇을 제외하고 사용자만 필터링
    } else {
      throw new Error('Failed to fetch users')
    }
  } catch (error) {
    console.error('Error fetching Slack users:', error)
    return []
  }
}

async function getUserFavoriteInfo(slackEmail) {
  if (!slackEmail) {
    console.error('Slack email is missing:', slackEmail)
    throw new Error('Slack email is required')
  }

  try {
    // 1. 사용자 ID 조회
    const [results] = await sequelize.query(
      `SELECT id FROM user WHERE slack_id = :slackEmail`,
      {
        replacements: { slackEmail }, // 파라미터 바인딩
        type: sequelize.QueryTypes.SELECT,
      }
    )

    // results가 undefined 또는 빈 배열일 경우 처리
    if (!results || results.length === 0) {
      console.log('No user found for the provided Slack email')
      return null // 이메일에 해당하는 사용자가 없으면 null 반환
    }
    const userId = results.id

    const keywords = await getUserKeywordLikeWithStockRank(userId)
    const stocks = await getUserStockLikeWithKeywordRank(userId)
    
    const userKeywordMsg = Object.entries(keywords)
      .map(
        ([keyword, stockList]) =>
          `*${keyword}* 관련 종목 랭킹\n` +
          stockList
            .slice(0, 3) // 상위 3개만
            .map((stock, index) => `${index + 1}. ${stock}`)
            .join('\n')
      )
      .join('\n\n')

    const userStockMsg = Object.entries(stocks)
      .map(
        ([stock, keywordList]) =>
          `*${stock}* 관련 키워드 랭킹\n` +
          keywordList
            .slice(0, 3) // 상위 3개만
            .map((keyword, index) => `${index + 1}. ${keyword}`)
            .join('\n')
      )
      .join('\n\n')

    const hasKeywords = Object.keys(keywords).length > 0
    const hasStocks = Object.keys(stocks).length > 0

    if (hasKeywords && hasStocks) {
        return `------------------------키워드 별 종목 랭킹------------------------\n${userKeywordMsg}\n\n------------------------종목 별 키워드 랭킹------------------------\n${userStockMsg}`
      } else if (hasKeywords) {
        return `------------------------키워드 별 종목 랭킹------------------------\n${userKeywordMsg}`
      } else if (hasStocks) {
        return `------------------------종목 별 키워드 랭킹------------------------\n${userStockMsg}`
      }   
  } catch (err) {
    console.error('Error fetching user favorite info:', err)
    throw err // 에러 처리
  }
}

const getUserKeywordLikeWithStockRank = async userId => {
  try {
    // 1. 사용자에 대한 즐겨찾기 종목 가져오기
    const stockResults = await sequelize.query(
      `
      SELECT k.keyword, s.stock_name
      FROM user_keyword uk
      JOIN keyword k ON uk.keyword = k.keyword
      JOIN stock s ON k.stock_id = s.id
      WHERE uk.user_id = :userId AND uk.alarm_status = 1
      ORDER BY k.weight DESC;
      `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!stockResults || stockResults.length === 0) {
      console.log('No results found for this user')
      return []
    }

    // 결과를 키워드별로 그룹화하여 반환
    const result = stockResults.reduce((acc, { keyword, stock_name }) => {
      if (!acc[keyword]) {
        acc[keyword] = []
      }
      acc[keyword].push(stock_name)
      return acc
    }, {})

    return result
  } catch (error) {
    console.error('Error fetching user keyword stock info:', error)
    throw error
  }
}

const getUserStockLikeWithKeywordRank = async userId => {
  try {
    // 1. 사용자에 대한 즐겨찾기 주식 가져오기
    const stockResults = await sequelize.query(
      `
      SELECT us.stock_id, s.stock_name
      FROM user_stock us
      JOIN stock s ON us.stock_id = s.id
      WHERE us.user_id = :userId
      `,
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!stockResults || stockResults.length === 0) {
      console.log('No results found for this user')
      return []
    }

    // 2. 각 주식에 대해 관련된 키워드를 가져오고 가중치가 높은 순으로 정렬
    const keywordResults = await sequelize.query(
      `
      SELECT k.keyword, k.stock_id, k.weight
      FROM keyword k
      WHERE k.stock_id IN (:stockIds)
      ORDER BY k.weight DESC
      `,
      {
        replacements: { stockIds: stockResults.map(stock => stock.stock_id) },
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!keywordResults || keywordResults.length === 0) {
      console.log('No keywords found for the stocks')
      return []
    }

    // 3. 결과를 주식별로 키워드 배열로 그룹화하여 반환
    const result = stockResults.reduce((acc, { stock_id, stock_name }) => {
      acc[stock_name] = keywordResults
        .filter(keyword => keyword.stock_id === stock_id)
        .map(keyword => keyword.keyword)
      return acc
    }, {})

    // 4. 결과 반환: { stock_name: [keyword1, keyword2, ...] }
    return result
  } catch (error) {
    console.error('Error fetching user stock keyword info:', error)
    throw error
  }
}

async function sendDM(userId, message) {
  try {
    const response = await webClient.chat.postMessage({
      channel: userId,
      text: message,
    })

    if (!response.ok) {
      console.error('Failed to send DM:', response.error)
    }
  } catch (error) {
    console.error('Error sending DM:', error)
  }
}

module.exports = {
  getSlackUsers,
  getUserFavoriteInfo,
  sendDM,
}
