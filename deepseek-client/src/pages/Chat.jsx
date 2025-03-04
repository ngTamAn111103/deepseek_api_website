// Import các thư viện và components cần thiết
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook điều hướng trang
import Sidebar from '../components/Sidebar'; // Component sidebar
import { mockChats } from '../data/mockData'; // Dữ liệu mẫu
import { colors } from '../config/colors'; // Cấu hình màu sắc
import { useAuth } from '../contexts/AuthContext'; // Context xác thực

// Component Chat chính
const Chat = () => {
  // Khởi tạo các hooks và states
  const navigate = useNavigate(); // Hook điều hướng
  const { user, isAuthenticated } = useAuth(); // Lấy thông tin user và trạng thái xác thực
  const [chats, setChats] = useState([]); // Danh sách chat
  const [currentChat, setCurrentChat] = useState(null); // Chat hiện tại
  const [messages, setMessages] = useState([]); // Danh sách tin nhắn
  const [newMessage, setNewMessage] = useState(''); // Tin nhắn mới
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const inputRef = useRef(null); // Ref cho input
  const messagesEndRef = useRef(null); // Ref cho việc scroll

  // Hàm tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect hook để tự động cuộn khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect hook kiểm tra xác thực
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Chuyển về trang login nếu chưa xác thực
      return;
    }
    setChats(mockChats); // Set dữ liệu mẫu
  }, [isAuthenticated, navigate]);

  // Hàm tạo chat mới
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      userId: user.id,
      title: 'Cuộc trò chuyện mới',
      timestamp: new Date().toISOString(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]); // Thêm chat mới vào đầu danh sách
    setCurrentChat(newChat); // Set chat hiện tại
    setMessages([]); // Reset tin nhắn
    inputRef.current?.focus(); // Focus vào input
  };

  // Hàm chọn chat
  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
    inputRef.current?.focus();
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    // Tạo tin nhắn người dùng
    const userMessage = {
      id: Date.now(),
      userId: user.id,
      content: newMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    try {
      // Giả lập gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tạo tin nhắn AI
      const aiMessage = {
        id: Date.now(),
        content: "Đây là phản hồi mẫu từ AI. Trong thực tế, bạn sẽ nhận được phản hồi từ API của DeepSeek.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Cập nhật tiêu đề chat nếu là tin nhắn đầu tiên
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
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar component */}
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        user={user}
      />

      {/* Khu vực chat */}
      <div className="flex-1 flex flex-col bg-white">
        {currentChat ? (
          <>
            {/* Header chat */}
            <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[#E3F2FD] rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00ACC1]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 
0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 
8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1F2937]">{currentChat.title}</h2>
                  <p className="text-sm text-[#4B5563]">
                    {new Date(currentChat.timestamp).toLocaleDateString('vi-VN', {     
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Khu vực tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">        
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
                        ? "bg-[#1E88E5] text-white shadow-sm"
                        : "bg-white text-[#1F2937] shadow-sm border border-[#E3F2FD]"  
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>   
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? "text-[#E3F2FD]" : "text-[#4B5563]"    
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
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3F2FD]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#00ACC1] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#00ACC1] rounded-full animate-bounce 
delay-100"></div>
                      <div className="w-2 h-2 bg-[#00ACC1] rounded-full animate-bounce 
delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Khu vực nhập tin nhắn */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent"
                  disabled={isLoading}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newMessage.trim()}
                  className="bg-[#1E88E5] text-white px-6 py-3 rounded-xl hover:bg-[#42A5F5] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center space-x-2"
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
          <div className="flex-1 flex items-center justify-center bg-[#F8FAFC]">       
            <div className="text-center">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-[#E3F2FD] mb-4 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#00ACC1]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 
01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 
7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#1F2937] mb-2">
                Chào mừng đến với DeepSeek Chat
              </h2>
              <p className="text-[#4B5563]">
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