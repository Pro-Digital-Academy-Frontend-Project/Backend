const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결

const Chat_Room = sequelize.define(
  'Chat_Room',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Chat_Room',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
)

module.exports = Chat_Room
