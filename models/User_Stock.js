const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결
const User = require('./User')
const Stock = require('./Stock')

const User_Stock = sequelize.define(
  'User_Stock',
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
    stock_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Stock,
        key: 'id',
      },
      allowNull: false,
    },
    alarm_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'User_Stock',
    timestamps: false,
  }
)

module.exports = User_Stock
