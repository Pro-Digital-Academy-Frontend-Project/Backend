const User_Keyword = require('../models/User_Keyword') // 모델 경로 주의 (대소문자 확인)

//user_keyword 추가
exports.addUserKeyword = async (req, res) => {
  const { keyword_id, alarm_status } = req.body
  const user_id = req.user.userId

  try {
    //사용자 키워드 생성
    const newUserKeyword = await User_Keyword.create({
      user_id,
      keyword_id,
      alarm_status,
    })

    res.status(201).json({
      message: '사용자 키워드 등록 성공',
      user_keyword_id: newUserKeyword.id,
    })
  } catch (error) {
    console.error('사용자 키워드 등록 오류:', error)
    res.status(500).json({ error: '키워드 즐겨찾기에 실패했습니다...' })
  }
}
