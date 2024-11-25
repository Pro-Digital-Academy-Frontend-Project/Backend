const sequelize = require('../db') // sequelize 인스턴스 가져오기

const User = require('./User')
const Stock = require('./Stock')
const Chat_Room = require('./Chat_Room')
const Chat_Room_Message = require('./Chat_Room_Message')
const Chat_Room_Message_Like = require('./Chat_Room_Message_Like')
const User_Keyword = require('./User_Keyword')
const User_Stock = require('./User_Stock')
const Keyword = require('./Keyword')

// 모델 관계 정의
// 1. User와 User_Keyword: 1:N 관계 (User는 여러 User_Keyword를 가질 수 있음)
User.hasMany(User_Keyword, { foreignKey: 'user_id' })
User_Keyword.belongsTo(User, { foreignKey: 'user_id' })

// 2. User와 User_Stock: 1:N 관계 (User는 여러 User_Stock을 가질 수 있음)
User.hasMany(User_Stock, { foreignKey: 'user_id' })
User_Stock.belongsTo(User, { foreignKey: 'user_id' })

// 4. User_Stock과 Stock: N:1 관계 (User_Stock은 하나의 Stock에 속함)
User_Stock.belongsTo(Stock, { foreignKey: 'stock_id' })
Stock.hasMany(User_Stock, { foreignKey: 'stock_id' })

// 5. Stock과 Keyword: 1:N 관계 (Stock은 여러 Keyword를 가질 수 있음)
Stock.hasMany(Keyword, { foreignKey: 'stock_id' })
Keyword.belongsTo(Stock, { foreignKey: 'stock_id' })

// 6. Chat_Room과 Chat_Room_Message: 1:N 관계 (Chat_Room은 여러 Chat_Room_Message를 가질 수 있음)
Chat_Room.hasMany(Chat_Room_Message, { foreignKey: 'room_id' })
Chat_Room_Message.belongsTo(Chat_Room, { foreignKey: 'room_id' })

// 7. Chat_Room_Message와 Chat_Room_Message_Like: 1:N 관계 (Chat_Room_Message는 여러 Chat_Room_Message_Like를 가질 수 있음)
Chat_Room_Message.hasMany(Chat_Room_Message_Like, { foreignKey: 'message_id' })
Chat_Room_Message_Like.belongsTo(Chat_Room_Message, {
  foreignKey: 'message_id',
})

// 8. User와 Chat_Room_Message_Like: 1:N 관계 (User는 여러 Chat_Room_Message_Like를 가질 수 있음)
User.hasMany(Chat_Room_Message_Like, { foreignKey: 'user_id' })
Chat_Room_Message_Like.belongsTo(User, { foreignKey: 'user_id' })

// 9. User와 Chat_Room_Message: 1:N 관계 (준승 추가)
User.hasMany(Chat_Room_Message, { foreignKey: 'user_id' });
Chat_Room_Message.belongsTo(User, { foreignKey: 'user_id' });

// 모델 내보내기
module.exports = {
  User,
  Stock,
  Chat_Room,
  Chat_Room_Message,
  Chat_Room_Message_Like,
  User_Keyword,
  User_Stock,
  Keyword,
  sequelize
}
