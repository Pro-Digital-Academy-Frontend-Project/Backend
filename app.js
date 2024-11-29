var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json') // 자동으로 생성된 Swagger JSON 문서

// 모델들을 가져옵니다.
const {
  User,
  Stock,
  Chat_Room,
  Chat_Room_Message,
  Chat_Room_Message_Like,
  User_Keyword,
  User_Stock,
  Keyword,
} = require('./models') // 모든 모델을 가져옴

var indexRouter = require('./routes/index')
var chatRouter = require('./routes/chat')
var usersRouter = require('./routes/userRoutes')
const keywordRouter = require('./routes/keywordRoutes')
const stockRouter = require('./routes/stockRoutes')

var app = express()

// 데이터베이스 연결 및 동기화
const sequelize = require('./db') // sequelize 연결을 가져옵니다.
const { fetchToken, renewToken } = require('./services/tokenService')

// 데이터베이스 동기화
sequelize
  .sync({ force: false }) // force: false는 기존 테이블을 덮어쓰지 않음
  .then(() => {
    console.log('데이터베이스 동기화 성공')
  })
  .catch(err => {
    console.error('데이터베이스 동기화 실패:', err)
  })

// 초기화 시 토큰 갱신
renewToken()

// 주기적 토큰 갱신 (8시간마다)
setInterval(async () => {
  try {
    await renewToken();
    console.log('정기 토큰 갱신 완료');
  } catch (error) {
    console.error('정기 토큰 갱신 오류:', error.message);
  }
}, 8 * 60 * 60 * 1000); // 8시간

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'], // 허용할 도메인
    credentials: true, // 쿠키를 사용할 수 있게 설정
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const mainRouter = express.Router()
mainRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
mainRouter.use('/', indexRouter)
mainRouter.use('/users', usersRouter)
mainRouter.use('/chat', chatRouter)
mainRouter.use('/keywords', keywordRouter)
mainRouter.use('/stocks', stockRouter)

app.use('/api', mainRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.json(res.locals)
})

module.exports = app
