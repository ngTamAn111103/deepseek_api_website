import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import Sidebar from "./Sidebar"; // Component thanh bên
import ChatContainer from "./ChatContainer"; // Component chứa nội dung chat
import Login from "./Login"; // Component đăng nhập
import Register from "./Register"; // Component đăng ký
const Chat = () => {
  // Các state quản lý trạng thái ứng dụng
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái xác thực người dùng
  const [showRegister, setShowRegister] = useState(false); // Hiển thị form đăng ký
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Trạng thái đóng/mở sidebar
  const [conversations, setConversations] = useState([]); // Danh sách các cuộc hội thoại
  const [activeConversationId, setActiveConversationId] = useState(null); // ID cuộc hội thoại đang active

    // Tạo cuộc hội thoại mới
    const handleNewChat = () => {
      const newChat = {
        id: Date.now().toString(),
        title: '',
        messages: [],
        lastMessageAt: new Date().toISOString(),
      };
      setConversations(prev => [newChat, ...prev]); // Thêm chat mới vào đầu danh sách
      setActiveConversationId(newChat.id); // Set chat mới làm active
      return newChat.id;
    };

    // Chọn một cuộc hội thoại
    const handleSelectConversation = (id) => {
      setActiveConversationId(id);
    };
    // Xử lý gửi tin nhắn
  const handleSendMessage = async (message, model) => {
    let currentConversationId = activeConversationId;
    
    // Tạo chat mới nếu chưa có
    if (!currentConversationId) {
      currentConversationId = handleNewChat();
    }
    
    // Cập nhật danh sách tin nhắn trong cuộc hội thoại
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [
          ...conv.messages, 
          { 
            role: 'user', 
            content: message,
            model: model
          }
        ];
        return {
          ...conv,
          messages: updatedMessages,
          title: conv.title || message.slice(0, 30) + '...', // Set tiêu đề là 30 ký tự đầu của tin nhắn
          lastMessageAt: new Date().toISOString(),
        };
      }
      return conv;
    }));

    console.log('Sending message with model:', model);
    
    return true;
  };

  // Lấy thông tin cuộc hội thoại đang active
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  return (
    <div className="relative h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
      <main 
        className={`absolute inset-0 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <ChatContainer
          messages={activeConversation?.messages || []}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default Chat; 