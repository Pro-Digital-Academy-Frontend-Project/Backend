const socketHandler = (io) => {
  const { Chat_Room_Message_Like } = require('../models') // 모든 모델을 가져옴

  // 활성화된 룸을 추적하기 위한 Set 생성
    const activeRooms = new Set();
  
    io.on("connection", (socket) => {
      console.log("새로운 클라이언트가 연결되었습니다:", socket.id);
  
      // 룸 참가 요청 처리
      socket.on("joinRoom", (roomId) => {
        console.log(`클라이언트 ${socket.id}가 룸 ${roomId}에 참가 요청`);
  
        // 이미 해당 룸에 있는지 확인
        if (!socket.rooms.has(roomId)) {
          // 새로운 룸이면 Set에 추가
          if (!activeRooms.has(roomId)) {
            activeRooms.add(roomId);
          }
  
          // 해당 룸에 참가
          socket.join(roomId);
          socket.data.roomId = roomId;
  
          // 룸 참가 알림 (socket.broadcast를 사용하여 자신을 제외한 다른 사용자에게만 알림)
        //   socket.broadcast
        //     .to(roomId)
        //     .emit("receiveMessage", `새로운 사용자가 입장했습니다: ${socket.id}`);
  
          // 룸에 접속한 사용자 수 계산
          const roomUsersCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
          // 참가한 사용자에게 현재 룸의 사용자 수를 알림
          io.to(roomId).emit("roomUserCount", roomUsersCount);
        }
      });
  
      // 전체 메시지 전송 처리
      socket.on("sendTotalMessage", (data) => {
        const { message_id, roomId, message, created_at, nickname } = data;
        console.log("sendTotalMessage");
        console.log(`[${roomId}] 메시지:`, data);
        io.to(roomId).emit("receiveTotalMessage", {
          roomId: `${roomId}`,
          message_id: `${message_id}`,
          message: `${message}`,
          created_at: `${created_at}`,
          nickname: `${nickname}`,
        });
      });

      // 좋아요 처리
      socket.on('likeMessage', async (data) => {
        const { messageId, roomId } = data;
      
        try {
          // 좋아요 수 계산
          const totalLikes = await Chat_Room_Message_Like.count({
            where: { message_id: messageId },
          });
      
          // 좋아요 이벤트를 방의 모든 클라이언트에게 전송
          io.to(roomId).emit('updateMessageLike', {
            messageId,
            totalLikes,
          });
        } catch (error) {
          console.error('좋아요 처리 중 오류:', error);
        }
      });
      
      // 좋아요 취소 처리
      socket.on('unlikeMessage', async (data) => {
        const { messageId, roomId } = data;
      
        try {
          // 좋아요 수 계산
          const totalLikes = await Chat_Room_Message_Like.count({
            where: { message_id: messageId },
          });
      
          // 좋아요 취소 이벤트를 방의 모든 클라이언트에게 전송
          io.to(roomId).emit('updateMessageLike', {
            messageId,
            totalLikes,
          });
        } catch (error) {
          console.error('좋아요 취소 처리 중 오류:', error);
        }
      });
  
      // Timeline메시지 전송 처리
      socket.on("sendTimeLineMessage", (data) => {
        const { username, roomId, message, timestamp } = data;
        console.log("sendTimeLineMessage");
        console.log(`[${roomId}] 메시지:`, message);
        io.to(roomId).emit("receiveTimeLineMessage", {
          username: `${username}`,
          roomId: `${roomId}`,
          message: `${message}`,
          timestamp: `${timestamp}`,
        });
      });
  
      // 룸 나가기 처리
      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`클라이언트 ${socket.id}가 룸 ${roomId}에서 나갔습니다`);
  
        //방 나감 알림
        // socket.broadcast
        //   .to(roomId)
        //   .emit("receiveMessage", `클라이언트가 방을 나갔습니다: ${socket.id}`);
  
        // 룸에 접속한 사용자 수 계산
        const roomUsersCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        // 참가한 사용자에게 현재 룸의 사용자 수를 알림
        io.to(roomId).emit("roomUserCount", roomUsersCount);
  
        // 해당 룸에 아무도 없으면 activeRooms에서 제거
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room) {
          activeRooms.delete(roomId);
          console.log(`룸 ${roomId}가 비어있어 제거되었습니다`);
        }
      });
  
      // 연결 끊김 처리
      socket.on("disconnect", () => {
        const roomId = socket.data.roomId;
  
        console.log("클라이언트 연결이 끊겼습니다.");
        //연결 끊김 알림
        socket.broadcast
          .to(roomId)
          .emit("receiveMessage", `클라이언트 연결이 끊겼습니다: ${socket.id}`);
  
        // 룸에 접속한 사용자 수 계산
        const roomUsersCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
        // 참가한 사용자에게 현재 룸의 사용자 수를 알림
        io.to(roomId).emit("roomUserCount", roomUsersCount);
      });
    });
  };
  
  module.exports = socketHandler;