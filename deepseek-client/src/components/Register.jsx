// Import các thư viện cần thiết từ React và React Router
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Component đăng ký người dùng
const Register = () => {
  // Hook điều hướng trang
  const navigate = useNavigate();

  // State quản lý dữ liệu form và thông báo lỗi
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Kiểm tra định dạng email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Kiểm tra độ mạnh của mật khẩu
  const validatePassword = (password) => {
    // Kiểm tra độ dài tối thiểu 8 ký tự
    if (password.length < 8) return false;
    
    // Kiểm tra có ít nhất 1 chữ hoa
    if (!/[A-Z]/.test(password)) return false;
    
    // Kiểm tra có ít nhất 1 chữ thường  
    if (!/[a-z]/.test(password)) return false;
    
    // Kiểm tra có ít nhất 1 số
    if (!/[0-9]/.test(password)) return false;
    
    // Kiểm tra có ít nhất 1 ký tự đặc biệt
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    
    return true;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra form có đầy đủ thông tin
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra định dạng email
    if (!validateEmail(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    // Kiểm tra độ mạnh mật khẩu
    if (!validatePassword(formData.password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      // Gọi API đăng ký
      const response = await fetch('http://localhost:5000/register', {
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
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      // Đăng ký thành công, chuyển hướng sang trang đăng nhập
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  // Render giao diện đăng ký
  return (
    // Container chính với gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Form đăng ký */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng ký</h2>
        
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
            {/* Hướng dẫn mật khẩu */}
            <p className="text-xs text-gray-500 mt-1">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
            </p>
            <p className="text-xs text-gray-500">
              Ví dụ: "DeepSeek@2024" là một mật khẩu hợp lệ
            </p>
          </div>

          {/* Input xác nhận mật khẩu */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Nút đăng ký */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Đăng ký
          </button>
        </form>

        {/* Link chuyển sang trang đăng nhập */}
        <p className="mt-4 text-center text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;