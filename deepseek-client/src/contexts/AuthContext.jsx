// 1. Import các dependencies cần thiết từ React
import React, { createContext, useContext, useState, useEffect } from 'react';

// 2. Tạo context để quản lý trạng thái xác thực
const AuthContext = createContext();

// 3. Custom hook useAuth để sử dụng AuthContext
export const useAuth = () => {
  // Lấy context từ useContext hook
  const context = useContext(AuthContext);
  // Kiểm tra xem hook có được sử dụng trong AuthProvider không
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// 4. AuthProvider component để quản lý state và cung cấp context
export const AuthProvider = ({ children }) => {
  // State để lưu thông tin user và trạng thái loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 5. useEffect để kiểm tra xác thực khi component mount
  useEffect(() => {
    const checkAuth = () => {
      // Lấy token và thông tin user từ localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      // Nếu có cả token và userData thì set user state
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
      // Kết thúc loading
      setLoading(false);
    };

    checkAuth();
  }, []);

  const updateUserBalance = (newBalance) => {
    setUser(prev => ({
      ...prev,
      balance: newBalance
    }));
    // Cập nhật localStorage
    const updatedUser = {...user, balance: newBalance};
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };


  // 6. Hàm login để xử lý đăng nhập
  const login = (userData) => {
    // Cập nhật state và lưu thông tin vào localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  // 7. Hàm logout để xử lý đăng xuất
  const logout = () => {
    // Xóa state và thông tin trong localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  

  // 8. Tạo object chứa các giá trị cần chia sẻ qua context
  const value = {
    user,
    loading,
    login,
    logout,
    updateUserBalance, // Thêm hàm mới
    isAuthenticated: !!user
  };


  // 9. Return AuthContext.Provider bao bọc children
  return (
    <AuthContext.Provider value={value}>
      {/* Chỉ render children khi đã load xong */}
      {!loading && children}
    </AuthContext.Provider>
  );
}; 