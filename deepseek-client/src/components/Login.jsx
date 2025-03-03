// Import các thư viện cần thiết từ React và React Router
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Component đăng nhập người dùng
const Login = () => {
  // Hook điều hướng trang
  const navigate = useNavigate();

  // State quản lý dữ liệu form và thông báo lỗi
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra form có đầy đủ thông tin
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      // Gọi API đăng nhập
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      // Xử lý response lỗi
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Đăng nhập thành công, chuyển hướng sang trang chat
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  // Render giao diện đăng nhập
  return (
    // Container chính với gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Form đăng nhập */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
        
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ email"
            />
          </div>

          {/* Input mật khẩu */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Đăng nhập
          </button>
        </form>

        {/* Link chuyển hướng tới trang đăng ký */}
        <p className="mt-4 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;