const Keyword = require('../models/Keyword')
const User_Keyword = require('../models/User_Keyword') // 모델 경로 주의 (대소문자 확인)
const sequelize = require('sequelize')

//user_keyword 추가
exports.addUserKeyword = async (req, res) => {
  const { keyword, alarm_status } = req.body
  const user_id = req.user.userId
  try {
    //사용자 키워드 생성
    const newUserKeyword = await User_Keyword.create({
      user_id,
      keyword,
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
  const { keyword } = req.query
  const user_id = req.user.userId
  try {
    // 해당 user_keyword_id에 해당하는 레코드 삭제
    const result = await User_Keyword.destroy({
      where: {
        keyword: keyword,
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

// // 특정 user의 user_keyword 조회
exports.getUserKeyword = async (req, res) => {
  const user_id = req.user.userId;
  try {
    // user_keyword 테이블에서 특정 사용자의 키워드 정보 조회
    const userKeywordList = await User_Keyword.findAll({
      where: { user_id },
      raw: true,
    });    

    // 각 userKeyword에 대해 가장 큰 keyword_id를 가져옵니다.
    const userKeywords = await Promise.all(userKeywordList.map(async (userKeyword) => {
      const keyword = await Keyword.findOne({
        where: { keyword: userKeyword.keyword },  // 동일한 keyword를 기준으로
        attributes: [[sequelize.fn('MAX', sequelize.col('id')), 'keyword_id']],  // 가장 큰 id를 가져옵니다.
        raw: true,
      });

      // userKeyword에 keyword_id를 추가하여 반환
      return {
        ...userKeyword,
        keyword_id: keyword ? keyword.keyword_id : null,  // 가장 큰 id를 keyword_id로 추가
      };
    }));

    console.log(userKeywords)
    
    // userKeyword와 가장 큰 keyword_id를 함께 응답
    res.status(200).json({ userKeywords });
  } catch (error) {
    console.error('사용자 키워드 조회 오류:', error);
    res.status(500).json({ error: '사용자 키워드 조회에 실패했습니다.' });
  }
};

//user_keyword의 알림 상태 업데이트
exports.updateUserKeyword = async (req, res) => {
  const user_id = req.user.userId
  const { id, alarm_status } = req.body
  console.log(id, alarm_status)
  try {
    const [updatedRows] = await User_Keyword.update(
      { alarm_status }, // 업데이트할 필드
      {
        where: {
          id: id,
          user_id: user_id,
        },
      }
    )
    if (updatedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }
    res.status(200).json({ message: '즐겨찾기 업데이트 성공' })
  } catch (error) {
    console.error('즐겨찾기 업데이트 오류:', error)
    res.status(500).json({ error: '즐겨찾기 업데이트에 실패했습니다.' })
  }
}

//user keyword 즐겨찾기 랭킹
exports.getKeywordLikeRankings = async (req, res) => {
  try {
    const rankings = await User_Keyword.findAll({
      attributes: [
        'keyword',
        [sequelize.fn('COUNT', sequelize.col('keyword')), 'count'],
      ],
      group: ['keyword'],
      order: [
        [sequelize.literal('count'), 'DESC'],
        ['keyword', 'ASC'],
      ],
      limit: 10, // 상위 10개의 키워드만
    })

    res.status(200).json({ rankings })
  } catch (error) {
    console.error('키워드 랭킹 조회 오류:', error)
    res.status(500).json({ error: '키워드 랭킹 조회에 실패했습니다.' })
  }
}
