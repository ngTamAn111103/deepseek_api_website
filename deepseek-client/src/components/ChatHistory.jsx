import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ChatHistory({ conversations, activeId, onSelect, onNewChat }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-gray-300 p-3 text-sm text-gray-700 hover:bg-gray-50"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      <div className="px-2 py-2">
        <h2 className="px-2 text-xs font-semibold text-gray-500">Lịch sử trò chuyện</h2>
        <div className="mt-2 space-y-1">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                activeId === chat.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              <span className="line-clamp-1 flex-1 text-left">
                {chat.title || 'Cuộc trò chuyện mới'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(chat.lastMessageAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 