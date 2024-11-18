const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware')

/* GET 채팅방 목록 조회 */
router.get('/chat-rooms', chatController.getChatRooms);

/* GET 특정 채팅방 메시지 조회 */
router.get('/chat-rooms/:room_id/messages', chatController.getMessagesByRoom);

/* POST 메시지 전송 */
router.post('/chat-rooms/:room_id/messages', authenticate, chatController.sendMessage);
// router.post('/chat-rooms/:room_id/messages', chatController.sendMessage);

/* POST 메시지 좋아요 */
router.post('/messages/:message_id/like', authenticate, chatController.likeMessage);
// router.post('/messages/:message_id/like', chatController.likeMessage);

/* POST 메시지 좋아요 취소 */
router.delete('/messages/:message_id/unlike', authenticate, chatController.unlikeMessage);
// router.delete('/messages/:message_id/unlike', chatController.unlikeMessage);

module.exports = router;