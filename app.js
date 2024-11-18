var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

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
var usersRouter = require('./routes/users')

var app = express()

// 데이터베이스 연결 및 동기화
const sequelize = require('./db') // sequelize 연결을 가져옵니다.

// 데이터베이스 동기화
sequelize
  .sync({ force: false }) // force: false는 기존 테이블을 덮어쓰지 않음
  .then(() => {
    console.log('데이터베이스 동기화 성공')
  })
  .catch(err => {
    console.error('데이터베이스 동기화 실패:', err)
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

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
