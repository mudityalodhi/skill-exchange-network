import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuth } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (isAuth && token) {
      socketRef.current = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('🔌 Socket connected');
      });

      socket.on('user_online', (userId) => {
        setOnlineUsers((prev) => [...new Set([...prev, userId])]);
      });

      socket.on('user_offline', (userId) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      socket.on('notification', () => {
        setUnreadNotifications((prev) => prev + 1);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [isAuth, token]);

  const joinConversation = (conversationId) => {
    socketRef.current?.emit('join_conversation', conversationId);
  };

  const leaveConversation = (conversationId) => {
    socketRef.current?.emit('leave_conversation', conversationId);
  };

  const sendTyping = (conversationId) => {
    socketRef.current?.emit('typing_start', { conversationId });
  };

  const stopTyping = (conversationId) => {
    socketRef.current?.emit('typing_stop', { conversationId });
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  const resetNotifications = () => setUnreadNotifications(0);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        unreadNotifications,
        joinConversation,
        leaveConversation,
        sendTyping,
        stopTyping,
        isOnline,
        resetNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
