import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Cuộc trò chuyện mới' },
  ]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenAmount, setTokenAmount] = useState('');
  const [userInfo, setUserInfo] = useState({
    username: 'Nguyễn Văn A',
    tokens: 1000
  });
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Xử lý tạo cuộc trò chuyện mới
  const handleNewChat = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: 'Cuộc trò chuyện mới'
    };
    setConversations([newConversation, ...conversations]);
    setSelectedConversation(newConversation);
    setShowNewChatModal(false);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage('');

    // TODO: Implement AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: 'Đây là phản hồi từ AI...',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Xử lý nạp token
  const handleAddTokens = async () => {
    try {
      // TODO: Implement token purchase logic
      setUserInfo(prev => ({
        ...prev,
        tokens: prev.tokens + parseInt(tokenAmount)
      }));
      setShowTokenModal(false);
      setTokenAmount('');
    } catch (error) {
      console.error('Lỗi khi nạp token:', error);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar nhỏ gọn */}
      <div className="w-16 bg-gray-100 border-r flex flex-col items-center py-4">
        {/* Logo */}
        <img src="/logo.webp" alt="DeepSeek Logo" className="w-8 h-8 mb-8" />

        {/* Nút tạo chat mới */}
        <button
          onClick={handleNewChat}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 mb-4"
        >
          +
        </button>

        {/* Danh sách cuộc trò chuyện */}
        <div className="flex-1 w-full overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-2 flex justify-center cursor-pointer hover:bg-gray-200 ${
                selectedConversation?.id === conv.id ? 'bg-gray-200' : ''
              }`}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {conv.id}
              </div>
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="mt-auto">
          <button
            onClick={() => setShowTokenModal(true)}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2"
          >
            💰
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
          >
            👤
          </button>
        </div>
      </div>

      {/* Khu vực chat chính */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold">DeepSeek Chat</h1>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold mb-2">Chào mừng đến với DeepSeek Chat</h2>
              <p className="text-gray-500">Bắt đầu cuộc trò chuyện bằng cách nhập câu hỏi của bạn</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl p-4 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                📎
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal nạp token */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Nạp token</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Số token hiện tại: {userInfo.tokens}</p>
            </div>
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Nhập số token muốn nạp"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTokens}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Nạp
            </button>
            <button
              onClick={() => setShowTokenModal(false)}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 