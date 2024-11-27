const User = require('../models/User') // 모델 경로 주의 (대소문자 확인)
const bcrypt = require('bcrypt')
const { createToken } = require('../middleware/authMiddleware')

exports.registerUser = async (req, res) => {
  const { account_id, password, nickname, slack_id } = req.body
  if (!account_id || !password || !nickname) {
    return res.status(400).json({ message: '필수 입력 필드가 누락되었습니다.' })
  }

  try {
    // 비밀번호 해시 처리
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const newUser = await User.create({
      account_id,
      password: hashedPassword,
      nickname,
      slack_id,
    })

    res.status(201).json({ message: '회원가입 성공', userId: newUser.id })
  } catch (error) {
    console.error('회원가입 오류:', error)
    res.status(500).json({ error: '회원가입에 실패했습니다.' })
  }
}

exports.getUserInfo = async (req, res) => {
  const user_id = req.user.userId
  try {
    const user = await User.findOne({
      where: {
        id: user_id,
      },
    })
    return res
      .status(200)
      .json({ nickname: user.nickname, slack_id: user.slack_id })
  } catch (error) {
    console.error('사용자 조회 오류:', error)
    res.status(500).json({ error: '사용자 조회에 실패했습니다.' })
  }
}

exports.loginUser = async (req, res) => {
  const { account_id, password } = req.body
  if (!account_id || !password) {
    return res
      .status(400)
      .json({ message: '아이디와 비밀번호를 입력해주세요.' })
  }

  try {
    // 사용자 조회
    const user = await User.findOne({ where: { account_id } })
    if (!user) {
      return res.status(404).json({ message: '아이디를 찾을 수 없습니다.' })
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    // JWT 토큰 생성 및 쿠키 설정
    const token = createToken({ userId: user.id })

    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    })
    res.json({ message: '로그인 성공', nickname: user.nickname })
  } catch (error) {
    console.error('로그인 오류:', error)
    res.status(500).json({ error: '로그인에 실패했습니다.' })
  }
}

exports.alarmUpdate = async (req, res) => {
  const user_id = req.user.userId
  const { slack_id } = req.body

  try {
    // slack_id 업데이트
    const [updatedRows] = await User.update(
      { slack_id }, // 업데이트할 필드
      {
        where: {
          id: user_id, // 조건: user_id가 일치하는 경우
        },
      }
    )

    if (updatedRows === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    res.status(200).json({ message: 'Slack ID 업데이트 성공' })
  } catch (error) {
    console.error('Slack ID 업데이트 오류:', error)
    res.status(500).json({ error: 'Slack ID 업데이트에 실패했습니다.' })
  }
}
