import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { mockChats } from '../data/mockData';
import { colors } from '../config/colors';

const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Sử dụng dữ liệu mẫu thay vì gọi API
    setChats(mockChats);
  }, [navigate]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'Cuộc trò chuyện mới',
      timestamp: new Date().toISOString(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setMessages([]);
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const userMessage = {
      id: Date.now(),
      content: newMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage = {
        id: Date.now(),
        content: "Đây là phản hồi mẫu từ AI. Trong thực tế, bạn sẽ nhận được phản hồi từ API của DeepSeek.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Cập nhật chat title nếu là tin nhắn đầu tiên
      if (currentChat.messages.length === 0) {
        const updatedChat = {
          ...currentChat,
          title: newMessage.slice(0, 50) + (newMessage.length > 50 ? '...' : ''),
          messages: [...currentChat.messages, userMessage, aiMessage]
        };
        setCurrentChat(updatedChat);
        setChats(prev => prev.map(chat => 
          chat.id === currentChat.id ? updatedChat : chat
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex h-screen bg-[${colors.lightBg}]`}>
      <Sidebar 
        chats={chats}
        currentChat={currentChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-[${colors.border}] rounded-xl`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-[${colors.accent}]`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-lg font-semibold text-[${colors.text.primary}]`}>{currentChat.title}</h2>
                  <p className={`text-sm text-[${colors.text.secondary}]`}>
                    {new Date(currentChat.timestamp).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-[${colors.lightBg}]`}>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? `bg-[${colors.primary}] text-white shadow-sm`
                        : `bg-white text-[${colors.text.primary}] shadow-sm border border-[${colors.border}]`
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? `text-[${colors.border}]` : `text-[${colors.text.secondary}]`
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`bg-white rounded-2xl p-4 shadow-sm border border-[${colors.border}]`}>
                    <div className="flex space-x-2">
                      <div className={`w-2 h-2 bg-[${colors.accent}] rounded-full animate-bounce`}></div>
                      <div className={`w-2 h-2 bg-[${colors.accent}] rounded-full animate-bounce delay-100`}></div>
                      <div className={`w-2 h-2 bg-[${colors.accent}] rounded-full animate-bounce delay-200`}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className={`flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[${colors.accent}] focus:border-transparent`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newMessage.trim()}
                  className={`bg-[${colors.primary}] text-white px-6 py-3 rounded-xl hover:bg-[${colors.secondary}] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center space-x-2`}
                >
                  <span>Gửi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center bg-[${colors.lightBg}]`}>
            <div className="text-center">
              <div className={`p-4 bg-white rounded-2xl shadow-sm border border-[${colors.border}] mb-4 inline-block`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-[${colors.accent}]`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className={`text-2xl font-semibold text-[${colors.text.primary}] mb-2`}>
                Chào mừng đến với DeepSeek Chat
              </h2>
              <p className={`text-[${colors.text.secondary}]`}>
                Bắt đầu một cuộc trò chuyện mới hoặc chọn một cuộc trò chuyện từ danh sách
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 