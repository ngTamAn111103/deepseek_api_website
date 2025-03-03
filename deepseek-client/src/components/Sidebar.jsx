import { useState } from 'react';
import { XMarkIcon, Bars3Icon, CreditCardIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import ChatHistory from './ChatHistory';
import TokenModal from './TokenModal';
import AccountModal from './AccountModal';

export default function Sidebar({ isOpen, setIsOpen, conversations, activeConversationId, onSelectConversation, onNewChat }) {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const navigation = [
    { 
      name: 'Nạp Token', 
      icon: CreditCardIcon, 
      onClick: () => setIsTokenModalOpen(true),
      current: false 
    },
    { 
      name: 'Tài khoản', 
      icon: UserCircleIcon, 
      onClick: () => setIsAccountModalOpen(true),
      current: false 
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar component */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">DeepSeek Chat</h1>
          </div>

          {/* Chat History */}
          <ChatHistory
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={onSelectConversation}
            onNewChat={onNewChat}
          />

          {/* Navigation */}
          <nav className="border-t border-gray-200 px-2 py-4">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                  item.current
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Người dùng</p>
                <p className="text-xs text-gray-500">100 tokens</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
} 