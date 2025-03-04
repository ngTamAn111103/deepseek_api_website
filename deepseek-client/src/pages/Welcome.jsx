// Import các thư viện cần thiết
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Component Welcome - Trang chào mừng
const Welcome = () => {
  // Hook useNavigate để điều hướng trang
  const navigate = useNavigate();

  return (
    // Container chính với gradient background
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      {/* Phần header với tiêu đề và mô tả */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-5xl font-bold text-white animate-fade-in">
          DeepSeek Clone
        </h1>
        <p className="text-lg text-gray-300 animate-slide-up">
          Khám phá sức mạnh của AI cùng chúng tôi
        </p>
      </div>
      
      {/* Container chứa các nút điều hướng */}
      <div className="flex space-x-6">
        {/* Nút đăng nhập với hiệu ứng hover và focus */}
        <button 
          className="transform rounded-lg bg-blue-600 px-8 py-3 text-white transition duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-bounce-in"
          onClick={() => navigate('/login')}
        >
          Đăng nhập
        </button>
        {/* Nút đăng ký với border và hiệu ứng hover */}
        <button 
          className="transform rounded-lg border-2 border-blue-600 px-8 py-3 text-white transition duration-300 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-bounce-in"
          onClick={() => navigate('/register')}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

// Export component Welcome
export default Welcome;