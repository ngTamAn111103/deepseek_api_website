import React, { useState } from 'react';
import { mockUser } from '../data/mockData';
import { colors } from '../config/colors';
import TokenModal from './TokenModal';

const Sidebar = ({ chats, currentChat, onNewChat, onSelectChat }) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const handleOpenTokenModal = () => {
    setIsTokenModalOpen(true);
  };

  const handleCloseTokenModal = () => {
    setIsTokenModalOpen(false);
  };

  return (
    <>
      <div className={`w-72 bg-[${colors.lightBg}] border-r border-gray-200 flex flex-col h-screen`}>
        {/* Logo và branding */}
        <div className="p-6 bg-white border-b border-gray-200">
          <h1 className={`text-xl font-semibold text-[${colors.accent}] text-center`}>DeepSeek Chat</h1>
        </div>

        {/* Nút tạo chat mới */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className={`w-full bg-[${colors.primary}] text-white px-4 py-3 rounded-xl hover:bg-[${colors.secondary}] transition-colors flex items-center justify-center font-medium shadow-sm`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Cuộc trò chuyện mới
          </button>
        </div>

        {/* Phần lịch sử chat */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <h2 className={`text-sm font-medium text-[${colors.text.secondary}]`}>Lịch sử trò chuyện</h2>
          </div>
          <div className="space-y-0.5 px-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                  currentChat?.id === chat.id 
                    ? `bg-[${colors.border}] text-[${colors.primary}] border border-[${colors.secondary}]` 
                    : `hover:bg-white text-[${colors.text.primary}]`
                }`}
              >
                <h3 className="text-sm font-medium truncate">
                  {chat.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Footer với thông tin người dùng và menu */}
        <div className="border-t border-gray-200 bg-white">
          <div className="p-4 flex items-center space-x-3">
            <img 
              src={mockUser.avatar} 
              alt="Avatar"
              className={`h-10 w-10 rounded-full ring-2 ring-[${colors.border}]`}
            />
            <div>
              <div className={`text-sm font-medium text-[${colors.text.primary}]`}>{mockUser.name}</div>
              <div className={`text-xs text-[${colors.highlight}] font-medium`}>{mockUser.tokenBalance} tokens</div>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button 
              onClick={handleOpenTokenModal}
              className={`p-4 flex items-center justify-center text-[${colors.text.secondary}] hover:bg-[${colors.lightBg}] transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-[${colors.success}]`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              Nạp Token
            </button>
            <button className={`p-4 flex items-center justify-center text-[${colors.text.secondary}] hover:bg-[${colors.lightBg}] transition-colors`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-[${colors.accent}]`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Cài đặt
            </button>
          </div>
        </div>
      </div>

      <TokenModal 
        isOpen={isTokenModalOpen}
        onClose={handleCloseTokenModal}
      />
    </>
  );
};

export default Sidebar;