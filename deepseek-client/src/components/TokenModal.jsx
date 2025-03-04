import React, { useState, useEffect } from 'react';
import { colors } from '../config/colors';

const TokenModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Chọn gói, 2: Hiển thị QR
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/topup-packages');
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages);
        } else {
          setError('Không thể tải danh sách gói token');
        }
      } catch (err) {
        setError('Đã có lỗi xảy ra khi tải danh sách gói token');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold text-[${colors.text.primary}]`}>
              {step === 1 ? 'Nạp Token' : 'Thanh Toán'}
            </h2>
            <button
              onClick={onClose}
              className={`text-[${colors.text.secondary}] hover:text-[${colors.text.primary}] transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-500">Đang tải danh sách gói...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPackage?.id === pkg.id
                        ? `border-[${colors.primary}] bg-[${colors.border}]`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${pkg.is_best_seller ? 'shadow-lg border-orange-400' : ''}`}
                  >
                    {pkg.is_best_seller && (
                      <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Phổ biến nhất 🔥
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-medium text-[${colors.text.primary}]`}>{pkg.package_name}</h3>
                        <p className={`text-sm text-[${colors.text.secondary}] mt-1`}>
                          {pkg.total_tokens.toLocaleString()} tokens
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-[${colors.primary}]`}>
                          {pkg.package_price.toLocaleString('vi-VN')}đ
                        </div>
                        <div className={`text-xs text-[${colors.text.secondary}]`}>
                          {(pkg.package_price / pkg.total_tokens).toFixed(2)}đ/token
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={`text-[${colors.text.primary}] font-medium`}>
                Quét mã QR để thanh toán
              </div>
              <div className="p-4 bg-white rounded-xl border-2 border-gray-200 inline-block">
                <div className={`w-48 h-48 bg-[${colors.border}] rounded-lg flex items-center justify-center`}>
                  <span className={`text-[${colors.text.secondary}]`}>QR Code</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className={`text-[${colors.text.primary}]`}>
                  Số tiền: {selectedPackage?.package_price.toLocaleString('vi-VN')}đ
                </div>
                <div className={`text-sm text-[${colors.text.secondary}]`}>
                  Tokens: {selectedPackage?.total_tokens.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            {step === 2 ? (
              <button
                onClick={handleBack}
                className={`px-6 py-2 rounded-xl text-[${colors.text.secondary}] hover:text-[${colors.text.primary}] transition-colors`}
              >
                Quay lại
              </button>
            ) : (
              <div></div>
            )}
            {step === 1 && (
              <button
                onClick={handleNext}
                disabled={!selectedPackage}
                className={`px-6 py-2 rounded-xl bg-[${colors.primary}] text-white hover:bg-[${colors.secondary}] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
              >
                Tiếp tục
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;