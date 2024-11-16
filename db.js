const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sal0925',
  database: 'stockey',
})

connection.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패 : ', err)
    return
  }
  console.log('데이터베이스에 연결되었습니다')
})

module.exports = connection
