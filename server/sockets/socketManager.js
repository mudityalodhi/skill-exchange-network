const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
const onlineUsers = new Map(); // userId -> socketId

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Auth middleware for socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    } else {
      next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);

    console.log(`🔌 User connected: ${userId}`);

    // Broadcast online status
    socket.broadcast.emit("user_online", userId);

    // Join personal room
    socket.join(userId);

    // Handle joining conversation rooms
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Typing indicators
    socket.on("typing_start", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing_start", { userId });
    });

    socket.on("typing_stop", ({ conversationId }) => {
      socket.to(`conv:${conversationId}`).emit("typing_stop", { userId });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user_offline", userId);
      console.log(`🔌 User disconnected: ${userId}`);
    });
  });

  return io;
};

const getSocketIO = () => io;

const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

const isUserOnline = (userId) => onlineUsers.has(userId.toString());

module.exports = { initSocket, getSocketIO, emitToUser, isUserOnline };
