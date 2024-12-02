const { WebClient } = require('@slack/web-api');
const schedule = require('node-schedule');
const { getSlackUsers, getUserFavoriteInfo, sendDM } = require('../services/slackService'); // 슬랙 관련 로직을 따로 서비스로 분리

const webClient = new WebClient(process.env.SLACK_API_TOKEN);

// 주기적인 작업 (매일 11시 30분에 DM 보내기)
schedule.scheduleJob('30 17 * * *', async () => {
  console.log('Sending DMs to all users...');
  const users = await getSlackUsers();
  for (const user of users) {
    // 1. 슬랙 이메일로 사용자의 즐겨찾기 정보 조회
    const userFavoriteInfo = await getUserFavoriteInfo(user.profile.email);

    if (userFavoriteInfo) {
      // 2. 각 사용자에게 DM 보내기
      await sendDM(user.id, `안녕하세요! 당신의 즐겨찾기 키워드: ${userFavoriteInfo.keywords.join(', ')}, 즐겨찾기한 주식: ${userFavoriteInfo.stockNames.join(', ')}`);
    }
  }
});

console.log('Slack DM scheduler is running...');
