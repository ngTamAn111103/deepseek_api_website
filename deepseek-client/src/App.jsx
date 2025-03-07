import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './App.css';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          {/* Thêm các route khác ở đây */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
