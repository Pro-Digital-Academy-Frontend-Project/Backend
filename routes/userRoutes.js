const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const userKeywordController = require('../controllers/userKeywordController')
const { authenticate } = require('../middleware/authMiddleware')

//로그인, 회원가입, 로그아웃
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.post('/logout', (req, res) => {
  res.clearCookie('authToken')
  res.json({ message: '로그아웃 성공' })
})

// 인증된 사용자 정보 가져오기
router.get('/me', authenticate, (req, res) => {
  res.json({ userId: req.user.userId })
})

//사용자 키워드
router.get('/keywords', authenticate, userKeywordController.getUserKeyword)
router.post('/keywords', authenticate, userKeywordController.addUserKeyword)
router.delete(
  '/keywords',
  authenticate,
  userKeywordController.deleteUserKeyword
)

module.exports = router
