import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Chào mừng đến với DeepSeek
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Khám phá sức mạnh của AI với DeepSeek - nền tảng trí tuệ nhân tạo tiên tiến
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300"
          >
            Đăng ký
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-600">Thông minh</h3>
            <p className="text-sm text-gray-600">AI tiên tiến</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-600">Nhanh chóng</h3>
            <p className="text-sm text-gray-600">Phản hồi tức thì</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-600">Chính xác</h3>
            <p className="text-sm text-gray-600">Kết quả đáng tin cậy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;