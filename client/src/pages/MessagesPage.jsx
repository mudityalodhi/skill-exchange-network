import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiSearch, FiMessageCircle } from 'react-icons/fi';
import { chatService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Avatar, OnlineDot } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const ConversationItem = ({ conv, currentUserId, isActive, onClick }) => {
  const other = conv.participants?.find((p) => p._id !== currentUserId);
  const lastMsg = conv.lastMessage;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${
        isActive ? 'bg-primary-500/10 border-r-2 border-primary-500' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar user={other} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-white text-sm font-semibold truncate">{other?.name}</p>
          {conv.lastMessageAt && (
            <span className="text-sen-muted text-xs flex-shrink-0 ml-2">
              {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <p className="text-sen-muted text-xs truncate mt-0.5 font-body">
          {lastMsg?.content || 'Start a conversation'}
        </p>
      </div>
    </button>
  );
};

const MessageBubble = ({ message, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} mb-3`}
  >
    {!isOwn && <Avatar user={message.sender} size="xs" />}
    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
          isOwn
            ? 'bg-primary-500 text-white rounded-br-sm'
            : 'bg-sen-card border border-sen-border text-white rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
      <span className="text-sen-muted text-xs mt-1 px-1">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </motion.div>
);

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation, sendTyping, stopTyping, isOnline } = useSocket();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Load conversations
  useEffect(() => {
    chatService.getConversations()
      .then(({ data }) => setConversations(data.conversations || []))
      .catch(console.error)
      .finally(() => setLoadingConvs(false));
  }, []);

  // Auto-open conversation if ?with= param is set
  useEffect(() => {
    const withId = searchParams.get('with');
    if (withId) {
      chatService.getOrCreate(withId)
        .then(({ data }) => {
          setActiveConv(data.conversation);
          setConversations((prev) => {
            const exists = prev.find((c) => c._id === data.conversation._id);
            return exists ? prev : [data.conversation, ...prev];
          });
        })
        .catch(console.error);
    }
  }, [searchParams]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    setMessages([]);
    joinConversation(activeConv._id);
    chatService.getMessages(activeConv._id)
      .then(({ data }) => setMessages(data.messages || []))
      .catch(console.error)
      .finally(() => setLoadingMsgs(false));

    return () => leaveConversation(activeConv._id);
  }, [activeConv?._id]);

  // Socket: receive new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ message, conversationId }) => {
      if (conversationId === activeConv?._id) {
        setMessages((prev) => [...prev, message]);
      }
      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? { ...c, lastMessage: message, lastMessageAt: message.createdAt }
            : c
        )
      );
    };

    const handleTypingStart = ({ userId }) => {
      if (userId !== user._id) setTyping(true);
    };

    const handleTypingStop = ({ userId }) => {
      if (userId !== user._id) setTyping(false);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [socket, activeConv?._id, user?._id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (activeConv) {
      sendTyping(activeConv._id);
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => stopTyping(activeConv._id), 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConv || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);
    stopTyping(activeConv._id);
    try {
      const { data } = await chatService.sendMessage(activeConv._id, content);
      setMessages((prev) => [...prev, data.message]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
            ? { ...c, lastMessage: data.message, lastMessageAt: data.message.createdAt }
            : c
        )
      );
    } catch (err) {
      toast.error(err.message);
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const otherUser = activeConv?.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="min-h-screen bg-sen-black pt-16 flex flex-col" style={{ height: '100vh' }}>
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full">
        {/* Sidebar */}
        <div className="w-full sm:w-80 border-r border-sen-border flex flex-col bg-sen-black flex-shrink-0 sm:flex">
          <div className="p-4 border-b border-sen-border">
            <h2 className="text-lg font-heading font-bold text-white mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-sen-card border border-sen-border rounded-xl px-3 py-2">
              <FiSearch size={14} className="text-sen-muted" />
              <input placeholder="Search conversations..." className="bg-transparent text-sm text-white placeholder:text-sen-muted focus:outline-none flex-1 font-body" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FiMessageCircle className="mx-auto text-sen-border mb-3" size={32} />
                <p className="text-sen-muted text-sm font-body">No conversations yet.</p>
                <p className="text-sen-muted text-xs mt-1 font-body">Visit a profile to start chatting.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conv={conv}
                  currentUserId={user?._id}
                  isActive={activeConv?._id === conv._id}
                  onClick={() => setActiveConv(conv)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${activeConv ? 'flex' : 'hidden sm:flex'}`}>
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">Your Messages</h3>
                <p className="text-sen-muted font-body text-sm">Select a conversation or start a new one.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-sen-border bg-sen-black">
                <button className="sm:hidden btn-ghost p-2" onClick={() => setActiveConv(null)}>←</button>
                <div className="relative">
                  <Avatar user={otherUser} size="md" />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sen-black ${isOnline(otherUser?._id) ? 'bg-sen-green' : 'bg-sen-muted'}`} />
                </div>
                <div>
                  <p className="text-white font-heading font-semibold">{otherUser?.name}</p>
                  <p className="text-xs font-body text-sen-muted flex items-center gap-1.5">
                    <OnlineDot isOnline={isOnline(otherUser?._id)} />
                    {isOnline(otherUser?._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-sen-muted text-sm font-body">Say hello to {otherUser?.name}!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <MessageBubble key={msg._id} message={msg} isOwn={msg.sender?._id === user?._id} />
                    ))}
                    {typing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-3">
                        <Avatar user={otherUser} size="xs" />
                        <div className="bg-sen-card border border-sen-border px-4 py-3 rounded-2xl rounded-bl-sm">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-sen-muted"
                                animate={{ y: [0, -4, 0] }} transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="px-5 py-4 border-t border-sen-border flex items-center gap-3">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder={`Message ${otherUser?.name}...`}
                  className="input flex-1 py-3 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
