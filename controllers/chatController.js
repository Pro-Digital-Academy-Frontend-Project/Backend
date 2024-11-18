const ChatModel = require('../models/chatModel');

// GET 채팅방 목록 조회
exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatModel.getChatRooms();
    res.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

// GET 특정 채팅방 메시지 조회
exports.getMessagesByRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    const messages = await ChatModel.getMessagesByRoom(room_id);
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
    const { user_id, message } = req.body;
    await ChatModel.sendMessage(room_id, user_id, message);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// POST 메시지 좋아요
exports.likeMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    await ChatModel.likeMessage(message_id);
    res.status(200).json({ message: 'Message liked successfully' });
  } catch (error) {
    console.error('Error liking message:', error);
    res.status(500).json({ error: 'Failed to like message' });
  }
};