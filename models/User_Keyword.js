const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결
const User = require('./User')
const Keyword = require('./Keyword')

const User_Keyword = sequelize.define(
  'User_Keyword',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alarm_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'User_Keyword',
    timestamps: false,
  }
)

module.exports = User_Keyword
