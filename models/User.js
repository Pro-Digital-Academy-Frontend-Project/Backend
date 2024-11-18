const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slack_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
)

module.exports = User
