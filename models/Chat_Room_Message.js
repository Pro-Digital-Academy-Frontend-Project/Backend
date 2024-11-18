const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결
const User = require('./User')
const Chat_Room = require('./Chat_Room')

const Chat_Room_Message = sequelize.define(
  'Chat_Room_Message',
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
    room_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Chat_Room,
        key: 'id',
      },
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'Chat_Room_Message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
)

module.exports = Chat_Room_Message
