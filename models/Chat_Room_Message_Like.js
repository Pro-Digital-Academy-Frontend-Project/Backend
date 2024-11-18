const { DataTypes } = require('sequelize')
const sequelize = require('../db') // sequelize 연결
const User = require('./User')
const Chat_Room_Message = require('./Chat_Room_Message')

const Chat_Room_Message_Like = sequelize.define(
  'Chat_Room_Message_Like',
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
    message_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Chat_Room_Message,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'Chat_Room_Message_Like',
    timestamps: false,
  }
)

module.exports = Chat_Room_Message_Like
