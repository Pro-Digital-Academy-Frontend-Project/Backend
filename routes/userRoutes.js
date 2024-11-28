const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const userKeywordController = require('../controllers/userKeywordController')
const userStockController = require('../controllers/userStockController')
const { authenticate } = require('../middleware/authMiddleware')

//로그인, 회원가입, 로그아웃
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.post('/logout', (req, res) => {
  res.clearCookie('authToken')
  res.json({ message: '로그아웃 성공' })
})
router.put('/alarm', authenticate, userController.alarmUpdate)
router.get('/info', authenticate, userController.getUserInfo)

// 인증된 사용자 정보 가져오기
router.get('/me', authenticate, (req, res) => {
  res.json({ userId: req.user.userId })
})

//사용자 키워드
router.get('/keywords', authenticate, userKeywordController.getUserKeyword)
router.get('/keywords/rankings', userKeywordController.getKeywordLikeRankings)
router.post('/keywords', authenticate, userKeywordController.addUserKeyword)
router.delete(
  '/keywords',
  authenticate,
  userKeywordController.deleteUserKeyword
)
router.put('/keywords', authenticate, userKeywordController.updateUserKeyword)

//사용자 종목
router.get('/stocks', authenticate, userStockController.getUserStock)
router.get('/stocks/rankings', userStockController.getStockLikeRankings)
router.post('/stocks', authenticate, userStockController.addUserStock)
router.delete('/stocks', authenticate, userStockController.deleteUserStock)
router.put('/stocks', authenticate, userStockController.updateUserStock)
router.get('/stocks/rankings/userLike', userStockController.getStcokRankByUserLike)

module.exports = router
