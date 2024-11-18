const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결
const Stock = require('./Stock')

const Keyword = sequelize.define(
  'Keyword',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'Keyword',
    timestamps: false,
  }
)

module.exports = Keyword
