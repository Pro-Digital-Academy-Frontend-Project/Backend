const db = require('../db')

const User = {
  getAll: callback => {
    db.query('SELECT * FROM User', callback)
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM User WHERE id = ?', [id], callback)
  },

  create: (data, callback) => {
    db.query('INSERT INTO User SET ?', data, callback)
  },

  update: (id, data, callback) => {
    db.query('UPDATE User SET ? WHERE id = ?', [data, id], callback)
  },

  delete: (id, callback) => {
    db.query('DELETE FROM User WHERE id = ?', [id], callback)
  },
}

module.exports = User
