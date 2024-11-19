const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const Stock = sequelize.define(
  'Stock',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    market: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Stock',
    timestamps: false,
  }
)

module.exports = Stock
