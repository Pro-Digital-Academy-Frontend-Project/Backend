const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: 'mysql',
})

sequelize
  .authenticate()
  .then(() => {
    console.log('데이터베이스에 연결되었습니다.')
  })
  .catch(err => {
    console.error('MySQL 연결 실패:', err)
  })

module.exports = sequelize
