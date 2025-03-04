import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    server: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const checkPasswordCriteria = (password) => {
    setPasswordCriteria({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password)
    });
  };

  const isFormValid = () => {
    // Kiểm tra lại tất cả điều kiện mỗi khi cần validate form
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = formData.password === formData.confirmPassword;
    const isPasswordFilled = formData.password.length > 0;
    const isConfirmPasswordFilled = formData.confirmPassword.length > 0;

    return isEmailValid && 
           isPasswordValid && 
           isConfirmPasswordValid &&
           isPasswordFilled &&
           isConfirmPasswordFilled;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Cập nhật tiêu chí mật khẩu khi thay đổi mật khẩu
    if (name === 'password') {
      checkPasswordCriteria(value);
    }

    // Xóa lỗi khi người dùng bắt đầu nhập lại
    setErrors(prev => ({
      ...prev,
      [name]: '',
      server: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Kiểm tra lại tất cả điều kiện trước khi submit
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      // Hiển thị thông báo thành công
      setShowSuccess(true);
      
      // Đợi 3 giây rồi chuyển trang
      setTimeout(() => {
        navigate('/login');
      }, 500);
      
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        server: error.message
      }));
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black">
      <div className="w-full max-w-md rounded-lg bg-white/10 p-8 shadow-lg backdrop-blur-sm">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Đăng ký tài khoản</h2>
        
        {showSuccess && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-center text-sm text-green-500">
            Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
          </div>
        )}

        {errors.server && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-center text-sm text-red-500">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ví dụ: MyP@ssw0rd123"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
            <div className="mt-2 text-xs">
              <p className="text-gray-400">Mật khẩu cần đáp ứng các yêu cầu sau:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li className={passwordCriteria.minLength ? "text-green-500" : "text-gray-400"}>
                  Tối thiểu 8 ký tự
                </li>
                <li className={passwordCriteria.hasUpperCase ? "text-green-500" : "text-gray-400"}>
                  Ít nhất 1 chữ hoa (A-Z)
                </li>
                <li className={passwordCriteria.hasLowerCase ? "text-green-500" : "text-gray-400"}>
                  Ít nhất 1 chữ thường (a-z)
                </li>
                <li className={passwordCriteria.hasNumber ? "text-green-500" : "text-gray-400"}>
                  Ít nhất 1 số (0-9)
                </li>
                <li className={passwordCriteria.hasSpecialChar ? "text-green-500" : "text-gray-400"}>
                  Ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                </li>
              </ul>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-white/5 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁️
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full transform rounded-lg px-4 py-2 text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isFormValid() 
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-300">
            Đã có tài khoản?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;