// const ChatModel = require('../models/chatModel');
const {verifyToken} = require("../middleware/authMiddleware")
const sequelize = require('sequelize')


const { Chat_Room, Chat_Room_Message, Chat_Room_Message_Like, User, User_Keyword, Keyword } = require('../models') // 모든 모델을 가져옴

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

// GET 특정 채팅방의 메시지, 좋아요 개수, 좋아요 여부, 유저 닉네임 조회
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
        {
          model: User,
          attributes: ['nickname'], // 유저 닉네임
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
          nickname: msg.User.nickname,
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
          nickname: msg.User.nickname,
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

    res.status(201).json({ message: 'Message sent successfully', message_id: newMessage.id, created_at: newMessage.created_at });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// POST 메시지 좋아요
exports.likeMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
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

// ------필요할 줄 알고 만들긴 했는데 안 씀--------
// GET 로그인된 유저의 특정 메시지의 좋아요 여부 조회
exports.getLikeStatus = async (req, res) => {
  try {
    const { message_id } = req.params; // URL에서 message_id를 가져옴
    const user_id = req.user.userId; // authenticate 미들웨어를 통해 user_id를 가져옴

    // 테이블에서 특정 message_id와 user_id를 가진 row 검색
    const like = await Chat_Room_Message_Like.findOne({
      where: {
        message_id: message_id,
        user_id: user_id,
      },
    });

    // 검색 결과가 존재하면 true, 없으면 false 반환
    if (like) {
      res.json({ likeStatus: true });
    } else {
      res.json({ likeStatus: false });
    }
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
};

// GET 가중치 기준 키워드 순위 Top5 리스트 조회
exports.getWeightRankings = async (req, res) => {
  try {
    const rankings = await Keyword.findAll({
      attributes: [
        'keyword',
        [sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight'],
      ],
      group: ['keyword'],
      order: [
        [sequelize.literal('totalWeight'), 'DESC'],
        ['keyword', 'ASC'],
      ],
      limit: 5, // 상위 5개의 키워드만
    })

    // Chat_Room 테이블에서 각 keyword에 대응하는 id를 추가
    const results = await Promise.all(
      rankings.map(async (ranking) => {
        const chatRoom = await Chat_Room.findOne({
          attributes: ['id'],
          where: { name: ranking.keyword },
        });

        return {
          room_id: chatRoom ? chatRoom.id : null, // Chat_Room이 없을 경우 null 처리
          keyword: ranking.keyword,
        };
      })
    );

    res.status(200).json({ results })
  } catch (error) {
    console.error('키워드 랭킹 조회 오류:', error)
    res.status(500).json({ error: '키워드 랭킹 조회에 실패했습니다.' })
  }
}

// GET 유저 즐겨찾기 수 기준 키워드 순위 Top5 리스트 조회
exports.getBookmarkRankings = async (req, res) => {
  try {
    // 유저 즐겨찾기 수 기준 상위 5개 키워드 뽑기
    const rankings = await User_Keyword.findAll({
      attributes: [
        'keyword',
        [sequelize.fn('COUNT', sequelize.col('keyword')), 'count'],
      ],
      group: ['keyword'],
      order: [
        [sequelize.literal('count'), 'DESC'],
        ['keyword', 'ASC'],
      ],
      limit: 5, // 상위 5개의 키워드만
    })

    // Chat_Room 테이블에서 각 keyword에 대응하는 id를 추가
    const results = await Promise.all(
      rankings.map(async (ranking) => {
        const chatRoom = await Chat_Room.findOne({
          attributes: ['id'],
          where: { name: ranking.keyword },
        });

        return {
          room_id: chatRoom ? chatRoom.id : null, // Chat_Room이 없을 경우 null 처리
          keyword: ranking.keyword,
          count: ranking.get('count'),
        };
      })
    );

    res.status(200).json({ results })
  } catch (error) {
    console.error('키워드 랭킹 조회 오류:', error)
    res.status(500).json({ error: '키워드 랭킹 조회에 실패했습니다.' })
  }
}