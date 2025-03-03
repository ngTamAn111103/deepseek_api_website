import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, BeakerIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

export default function ChatContainer({ messages = [], onSendMessage }) {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');
  const [isSending, setIsSending] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setShowWelcome(true);
    } else {
      setShowWelcome(false);
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageToSend = input.trim();
    const modelToUse = selectedModel;

    try {
      setIsSending(true);
      if (messages.length === 0) {
        setIsCreatingChat(true);
      }
      
      const success = await onSendMessage(messageToSend, modelToUse);
      if (success) {
        setInput('');
        setShowWelcome(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    } finally {
      setIsSending(false);
      setIsCreatingChat(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ngăn chặn hành vi submit mặc định khi nhấn Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showWelcome && messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <div className="text-center transform transition-all duration-500 ease-out">
              <h3 className="text-xl font-semibold text-gray-900">
                Chào mừng đến với DeepSeek Chat
              </h3>
              <p className="mt-2 text-gray-600">
                Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isCreatingChat && (
              <div className="flex justify-center py-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang tạo cuộc trò chuyện mới...</span>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm transform transition-all duration-300 ease-out
                    ${message.role === 'user'
                      ? message.model === 'deepseek-chat'
                        ? 'bg-blue-500 text-white animate-message-in-right'
                        : 'bg-purple-500 text-white animate-message-in-right'
                      : 'bg-white text-gray-900 animate-message-in-left'
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="chat-form mx-auto max-w-4xl">
          <div className="flex flex-col space-y-3">
            {/* Model selector */}
            <div className="inline-flex justify-center rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setSelectedModel('deepseek-chat')}
                disabled={isSending}
                className={`inline-flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all
                  ${selectedModel === 'deepseek-chat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                <span>Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedModel('deepseek-reasoner')}
                disabled={isSending}
                className={`inline-flex items-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all
                  ${selectedModel === 'deepseek-reasoner'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BeakerIcon className="h-4 w-4" />
                <span>Reasoner</span>
              </button>
            </div>

            {/* Input and send button */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn của bạn..."
                  className={`input w-full pr-24 ${
                    selectedModel === 'deepseek-chat'
                      ? 'focus:ring-blue-500'
                      : 'focus:ring-purple-500'
                  }`}
                  disabled={isSending}
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                  {selectedModel === 'deepseek-chat' ? (
                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-blue-400" />
                  ) : (
                    <BeakerIcon className="h-4 w-4 text-purple-400" />
                  )}
                  <span className={`text-xs ${
                    selectedModel === 'deepseek-chat'
                      ? 'text-blue-500'
                      : 'text-purple-500'
                  }`}>
                    {selectedModel === 'deepseek-chat' ? 'Chat' : 'Reasoner'}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                className={`btn flex items-center space-x-2 min-w-[100px] ${
                  selectedModel === 'deepseek-chat'
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                    : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
                }`}
                disabled={!input.trim() || isSending}
              >
                <PaperAirplaneIcon className={`h-5 w-5 text-white ${isSending ? 'animate-spin' : ''}`} />
                <span className="text-white">{isSending ? 'Đang gửi...' : 'Gửi'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 