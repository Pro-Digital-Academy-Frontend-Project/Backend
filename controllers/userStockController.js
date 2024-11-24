const User_Stock = require('../models/User_Stock') // 모델 경로 주의 (대소문자 확인)
const Stock = require('../models/Stock')

//User_Stock 추가
exports.addUserStock = async (req, res) => {
  const { stock_id, alarm_status } = req.body
  const user_id = req.user.userId
  try {
    //사용자 키워드 생성
    const newUserStock = await User_Stock.create({
      user_id,
      stock_id,
      alarm_status,
    })
    res.status(201).json({
      message: '사용자 종목 등록 성공',
      user_stock_id: newUserStock.id,
    })
  } catch (error) {
    console.error('사용자 종목 등록 오류:', error)
    res.status(500).json({ error: '종목 즐겨찾기에 실패했습니다...' })
  }
}

// User_Stock 삭제
exports.deleteUserStock = async (req, res) => {
  const { stock_id } = req.query
  const user_id = req.user.userId

  try {
    // user_id와 stock_id가 일치하는 레코드 삭제
    const result = await User_Stock.destroy({
      where: {
        stock_id: stock_id,
        user_id: user_id,
      },
    })
    if (result === 0) {
      return res
        .status(404)
        .json({ message: '삭제할 종목을 찾을 수 없습니다.' })
    }
    res.status(200).json({ message: '사용자 종목 삭제 성공' })
  } catch (error) {
    console.error('사용자 종목 삭제 오류:', error)
    res.status(500).json({ error: '종목 삭제에 실패했습니다.' })
  }
}

// 특정 user의 User_Stock 조회
exports.getUserStock = async (req, res) => {
  const user_id = req.user.userId
  try {
    // 특정 사용자에 대한 모든 종목 조회
    const userStocks = await User_Stock.findAll({
      where: { user_id },
      attributes: ['id', 'stock_id', 'alarm_status'], // 필요한 필드만 선택
      include: [
        {
          model: Stock, // Stock 테이블과 관계 연결
          attributes: ['stock_name', 'code'], // 필요한 필드만 포함
        },
      ],
    })

    // 응답 데이터 가공
    const response = userStocks.map(stock => ({
      id: stock.id,
      stock_id: stock.stock_id,
      alarm_status: stock.alarm_status,
      stock_name: stock.Stock.stock_name, // Stock 정보 추가
      stock_code: stock.Stock.code,
    }))

    res.status(200).json({ userStocks: response })
  } catch (error) {
    console.error('사용자 종목 조회 오류:', error)
    res.status(500).json({ error: '사용자 종목 조회에 실패했습니다.' })
  }
}

exports.updateUserStock = async (req, res) => {
  const user_id = req.user.userId
  const { id, alarm_status } = req.body
  try {
    const [updatedRows] = await User_Stock.update(
      { alarm_status }, // 업데이트할 필드
      {
        where: {
          id: id, // 조건: user_id가 일치하는 경우
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
