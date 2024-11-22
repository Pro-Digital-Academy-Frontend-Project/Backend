// const ChatModel = require('../models/chatModel');
const {verifyToken} = require("../middleware/authMiddleware")

const { Chat_Room, Chat_Room_Message, Chat_Room_Message_Like } = require('../models') // 모든 모델을 가져옴

// GET 채팅방 목록 조회
exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await Chat_Room.findAll(); // 모든 레코드 조회
    res.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

// // GET 특정 채팅방 메시지 조회
// exports.getMessagesByRoom = async (req, res) => {
//   try {
//     const { room_id } = req.params;
//     const messages = await Chat_Room_Message.findAll({
//         where: { room_id: room_id },
//         attributes: { exclude: ['room_id'] } // Sequelize에서 특정 컬럼 제외
//     });
//     res.json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// };

// GET 특정 채팅방의 메시지 및 좋아요 개수 조회
exports.getMessagesByRoom = async (req, res) => {
  try {
    const { room_id } = req.params;
    // const userId = req.user.userId; // authenticate 미들웨어를 거치면 이 값을 받을 수 있음

    // 메시지 및 좋아요 수, 좋아요 여부 조회
    const messages = await Chat_Room_Message.findAll({
      where: { room_id: room_id },
      attributes: ['id', 'message', 'created_at'],
      include: [
        {
          model: Chat_Room_Message_Like,
          attributes: ['user_id'], // 좋아요한 유저 정보
        },
      ],
    });

    // 로그인 여부 확인
    let token = req.cookies['authToken']
    let headerToken = req.headers.authorization
    if (!token && headerToken) {
      token = headerToken.split(' ')[1]
    }

    // 로그인이 되어있지 않은 경우는 likedByUser가 항상 false
    if (!token) {
      const formattedMessages = messages.map((msg) => {
        const totalLikes = msg.Chat_Room_Message_Likes.length; // 좋아요 총 개수
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          totalLikes: totalLikes,
          likedByUser: false,
        };
      });
      res.json(formattedMessages);
    } else { // 로그인된 경우 해당 userId값으로 좋아요를 누른 댓글 표시
      const user = verifyToken(token);
      const userId = user.userId;
      const formattedMessages = messages.map((msg) => {
        const totalLikes = msg.Chat_Room_Message_Likes.length; // 좋아요 총 개수
        const likedByUser = msg.Chat_Room_Message_Likes.some((like) => like.user_id === userId); // 현재 유저가 좋아요 했는지
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          totalLikes: totalLikes,
          likedByUser: likedByUser,
        };
      });
      res.json(formattedMessages);
    }

  } catch (error) {
    console.error('Error fetching messages with likes:', error);
    res.status(500).json({ error: 'Failed to fetch messages with likes' });
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