const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware')

/* GET 채팅방 목록 조회 */
router.get('/chat-rooms', chatController.getChatRooms);

/* GET 특정 채팅방 메시지 조회 */
// router.get('/chat-rooms/:room_id/messages', authenticate, chatController.getMessagesByRoom);
router.get('/chat-rooms/:room_id/messages', chatController.getMessagesByRoom);

/* POST 메시지 전송 */
router.post('/chat-rooms/:room_id/messages', authenticate, chatController.sendMessage);
// router.post('/chat-rooms/:room_id/messages', chatController.sendMessage);

/* POST 메시지 좋아요 */
router.post('/messages/:message_id/like', authenticate, chatController.likeMessage);
// router.post('/messages/:message_id/like', chatController.likeMessage);

/* DELETE 메시지 좋아요 취소 */
router.delete('/messages/:message_id/unlike', authenticate, chatController.unlikeMessage);
// router.delete('/messages/:message_id/unlike', chatController.unlikeMessage);

// ------필요할 줄 알고 만들긴 했는데 안 씀--------
/* GET 로그인된 유저의 특정 메시지의 좋아요 여부 조회 */
router.get('/messages/:message_id/like-status', authenticate, chatController.getLikeStatus);

module.exports = router;