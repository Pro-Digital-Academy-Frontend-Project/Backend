const moment = require('moment')
const schedule = require('node-schedule')
const {
  getSlackUsers,
  getUserFavoriteInfo,
  sendDM,
} = require('../services/slackService') // 슬랙 관련 로직을 따로 서비스로 분리

console.log("SlackScheduler.js 실행")
// 주기적인 작업 (매일 오전 8시 00분에 DM 보내기)
schedule.scheduleJob('00 10 * * *', async () => {
  console.log("스케줄러 등록 완료 1")
  await alarm()
  console.log('Alarm finished 2');
})
// 3분마다 DM 보내기
// schedule.scheduleJob('*/3 * * * *', async () => {
//   alarm();
// });

const alarm = async () => {
  console.log('Sending DMs to all users...')
  const users = await getSlackUsers()
  for (const user of users) {
    try {
      // 사용자 즐겨찾기 정보 조회
      const userFavoriteInfo = await getUserFavoriteInfo(user.profile.email)

      if (userFavoriteInfo) {
        // 사용자 DM 발송
        const today = moment().format('YYYY년 MM월 DD일 기준')
        const message = `나만의 키워드 Stockey로 주식을 열어보세요\n\n안녕하세요, ${user.profile.real_name}님!\n\n${today}\n\n${userFavoriteInfo}\n\n자세한 내용은 http://3.37.15.228/ 를 방문하여 확인하세요`
        await sendDM(user.id, message)
        console.log(`DM sent to ${user.profile.real_name}`)
      }
    } catch (error) {
      console.error(`Failed to send DM to ${user.profile.real_name}:`, error)
    }
  }
}