const { WebClient } = require('@slack/web-api');
const db = require('../db'); // 데이터베이스 연결
require('dotenv').config();

const webClient = new WebClient(process.env.SLACK_API_TOKEN);

async function getSlackUsers() {
  try {
    const response = await webClient.users.list();
    if (response.ok) {
      return response.members.filter(member => !member.is_bot && member.profile?.email); // 봇을 제외하고 사용자만 필터링
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    console.error('Error fetching Slack users:', error);
    return [];
  }
}

async function getUserFavoriteInfo(slackEmail) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM user WHERE slack_id = ?`;
    db.query(query, [slackEmail], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return reject(err);
      }

      if (results.length === 0) {
        return resolve(null); // 이메일에 해당하는 사용자가 없으면 null 반환
      }

      const userId = results[0].id;

      const favoriteKeywordsQuery = `SELECT keyword FROM user_keyword WHERE user_id = ? AND alarm_status = 1`;
      const favoriteStocksQuery = `SELECT s.stock_name FROM user_stock us JOIN stock s ON us.stock_id = s.id WHERE us.user_id = ? AND us.alarm_status = true`;

      db.query(favoriteKeywordsQuery, [userId], (err, keywordResults) => {
        if (err) {
          console.error('Error fetching keywords:', err);
          return reject(err);
        }

        db.query(favoriteStocksQuery, [userId], (err, stockResults) => {
          if (err) {
            console.error('Error fetching stocks:', err);
            return reject(err);
          }

          const keywords = keywordResults.map(kw => kw.keyword);
          const stockNames = stockResults.map(stock => stock.stock_name);

          console.log('User favorite keywords:', keywords);
          console.log('User favorite stocks:', stockNames);

          resolve({ keywords, stockNames });
        });
      });
    });
  });
}

async function sendDM(userId, message) {
  try {
    const response = await webClient.chat.postMessage({
      channel: userId,
      text: message,
    });

    if (!response.ok) {
      console.error('Failed to send DM:', response.error);
    }
  } catch (error) {
    console.error('Error sending DM:', error);
  }
}

module.exports = {
  getSlackUsers,
  getUserFavoriteInfo,
  sendDM,
};