const db = require('../db')
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = {
  create: async (userData, callback) => {
    try {
      // 회원가입 시 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
      const data = { ...userData, password: hashedPassword }
      db.query('INSERT INTO user SET ?', data, callback)
    } catch (error) {
      callback(error, null)
    }
  },

  findByAccountId: (accountId, callback) => {
    db.query('SELECT * FROM user WHERE account_id = ?', [accountId], callback)
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback)
  },
}

module.exports = User
