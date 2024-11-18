const db = require('../db');

// 채팅방 목록 조회
// exports.getChatRooms = async () => {
//   const query = 'SELECT * FROM stockey.chat_rooms';
//   const [rows] = await db.promise().query(query);
//   return rows;
// };
exports.getChatRooms = async () => {
    const query = 'SELECT * FROM chat_room';
    const [rows] = await db.query(query, { type: db.QueryTypes.SELECT });
    return rows;
  };

// 특정 채팅방 메시지 조회
exports.getMessagesByRoom = async (room_id) => {
  const query = 'SELECT * FROM messages WHERE room_id = ?';
  const [rows] = await db.promise().query(query, [room_id]);
  return rows;
};

// 메시지 전송
exports.sendMessage = async (room_id, user_id, message) => {
  const query = 'INSERT INTO messages (room_id, user_id, message, created_at) VALUES (?, ?, ?, NOW())';
  await db.promise().query(query, [room_id, user_id, message]);
};

// 메시지 좋아요
exports.likeMessage = async (message_id) => {
  const query = 'UPDATE messages SET likes = likes + 1 WHERE id = ?';
  await db.promise().query(query, [message_id]);
};