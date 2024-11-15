const mysql = require('mysql2')
require('dotenv').config();

// .env 파일에 설정된 환경 변수를 사용하여 MySQL 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // MySQL 컨테이너 이름
  user: process.env.DB_USER,      // MySQL 사용자명
  password: process.env.DB_PASSWORD, // MySQL 비밀번호
  database: process.env.DB_DATABASE, // 데이터베이스 이름
});


connection.connect(err => {
  if (err) {
    console.error('MySQL 연결 실패 : ', err)
    return
  }
  console.log('데이터베이스에 연결되엇습니다')
})

module.exports = connection
