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

// user_keyword 삭제
exports.deleteUserKeyword = async (req, res) => {
  const { keyword_id } = req.body
  const user_id = req.user.userId
  try {
    // 해당 user_keyword_id에 해당하는 레코드 삭제
    const result = await User_Keyword.destroy({
      where: {
        id: keyword_id,
        user_id: user_id,
      },
    })
    if (result === 0) {
      return res
        .status(404)
        .json({ message: '삭제할 키워드를 찾을 수 없습니다.' })
    }
    res.status(200).json({ message: '사용자 키워드 삭제 성공' })
  } catch (error) {
    console.error('사용자 키워드 삭제 오류:', error)
    res.status(500).json({ error: '키워드 삭제에 실패했습니다.' })
  }
}

// 특정 user의 user_keyword 조회
exports.getUserKeyword = async (req, res) => {
  const user_id = req.user.userId
  try {
    // 특정 사용자에 대한 모든 키워드 조회
    const userKeywords = await User_Keyword.findAll({
      where: {
        user_id,
      },
    })
    res.status(200).json({ userKeywords })
  } catch (error) {
    console.error('사용자 키워드 조회 오류:', error)
    res.status(500).json({ error: '사용자 키워드 조회에 실패했습니다.' })
  }
}
