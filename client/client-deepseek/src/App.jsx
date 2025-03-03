import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = (formData) => {
    // TODO: Implement registration logic
    console.log('Đăng ký với:', formData);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: '',
      messages: [],
      lastMessageAt: new Date().toISOString(),
    };
    setConversations(prev => [newChat, ...prev]);
    setActiveConversationId(newChat.id);
    return newChat.id;
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
  };

  const handleSendMessage = async (message, model) => {
    let currentConversationId = activeConversationId;
    
    if (!currentConversationId) {
      currentConversationId = handleNewChat();
    }
    
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
          title: conv.title || message.slice(0, 30) + '...',
          lastMessageAt: new Date().toISOString(),
        };
      }
      return conv;
    }));

    console.log('Sending message with model:', model);
    
    return true;
  };

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
}

export default App;
