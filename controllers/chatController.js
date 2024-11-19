// const ChatModel = require('../models/chatModel');

const { Chat_Room, Chat_Room_Message, Chat_Room_Message_Like } = require('../models') // 모든 모델을 가져옴

// GET 채팅방 목록 조회
exports.getChatRooms = async (req, res) => {
  try {
    const rows = await Chat_Room.findByPk(1); //  키 기준 단일 레코드 찾기
    res.json(rows);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

// GET 특정 채팅방 메시지 조회
exports.getMessagesByRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    const messages = await Chat_Room_Message.findAll({
        where: { room_id: room_id },
        attributes: { exclude: ['room_id'] } // Sequelize에서 특정 컬럼 제외
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// POST 메시지 전송
exports.sendMessage = async (req, res) => {
  try {
    const { room_id } = req.params;
    const { message } = req.body;
    const newMessage = await Chat_Room_Message.create({
        user_id: req.user.userId, // authenticate 미들웨어를 거치면 이 값을 받을 수 있음
        room_id: room_id,
        message: message,
      });
    res.status(201).json({ message: 'Message sent successfully', message_id: newMessage.id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// POST 메시지 좋아요
exports.likeMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    console.log("메시지 아이디: ", message_id, "유저 아이디: ", req.user.userId);
    await Chat_Room_Message_Like.create({
        user_id: req.user.userId, // authenticate 미들웨어를 거치면 이 값을 받을 수 있음
        message_id: message_id,
    });
    res.status(200).json({ message: 'Message liked successfully' });
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Failed to like message' });
  }
};

// DELETE 메시지 좋아요 취소
exports.unlikeMessage = async (req, res) => {
    try {
      const { message_id } = req.params;
      console.log(message_id, req.user.userId)
      await Chat_Room_Message_Like.destroy({
        where: {
          user_id: req.user.userId, // authenticate 미들웨어를 거치면 이 값을 받을 수 있음
          message_id: message_id,
        }
      });
      res.status(200).json({ message: 'Message unliked successfully' });
    } catch (error) {
      console.error('Error liking message:', error);
      res.status(500).json({ error: 'Failed to unlike message' });
    }
  };