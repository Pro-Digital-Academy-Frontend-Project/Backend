const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

/* GET 채팅방 목록 조회 */
router.get('/chat-rooms', chatController.getChatRooms);

/* GET 특정 채팅방 메시지 조회 */
router.get('/chat-rooms/:room_id/messages', chatController.getMessagesByRoom);

/* POST 메시지 전송 */
router.post('/chat-rooms/:room_id/messages', chatController.sendMessage);

/* POST 메시지 좋아요 */
router.post('/messages/:message_id/like', chatController.likeMessage);

module.exports = router;