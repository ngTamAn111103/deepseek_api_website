import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TokenModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Chọn gói, 2: Hiển thị QR
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [loadingQR, setLoadingQR] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionCode, setTransactionCode] = useState(null);
  const { user, updateUserBalance } = useAuth(); // Thêm hook

  // Reset state khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedPackage(null);
      setPackages([]); 
      setError(null);
      setQrCode('');
      setLoadingQR(false);
      setTransactionId(null);
      setTransactionCode(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/topup-packages');
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages);
          // Tự động chọn gói best seller
          const bestSellerPackage = data.packages.find(pkg => pkg.is_best_seller);
          if (bestSellerPackage) {
            setSelectedPackage(bestSellerPackage);
          }
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

  const handleNext = async () => {
    try {
      setLoadingQR(true);
      
      // Tạo mã giao dịch ngẫu nhiên duy nhất
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const addInfo = `NAPTK${user.id}T${timestamp}${randomStr}`;
      setTransactionCode(addInfo);

      // Tạo giao dịch mới
      const response = await fetch('http://localhost:5000/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package_id: selectedPackage.id,
          user_id: user.id,
          payment_method: "VietQR",
          transaction_code: addInfo
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Không thể tạo giao dịch');
      }

      setTransactionId(data.transaction_id);

      // Tạo QR code từ VietQR
      const amount = selectedPackage.package_price;
      const qrUrl = `https://img.vietqr.io/image/VPBank-3528111103-qr_only.jpg?amount=${amount}&addInfo=${addInfo}&accountName=Nguyen%20Tam%20An`;
      
      setQrCode(qrUrl);
      setStep(2);

    } catch (err) {
      setError('Đã có lỗi xảy ra khi tạo giao dịch');
      console.error('Error creating transaction:', err);
    } finally {
      setLoadingQR(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    onClose();
  };

  const handleFinishPayment = async () => {
    try {
      const response = await fetch('http://localhost:5000/confirm-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: transactionId,
          transaction_code: transactionCode
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Không thể xác nhận giao dịch');
      }

      // Cập nhật số dư mới
      if (data.new_balance !== undefined) {
        updateUserBalance(data.new_balance);
      }

      onClose();
    } catch (err) {
      setError('Đã có lỗi xảy ra khi xác nhận giao dịch');
      console.error('Error confirming transaction:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1F2937]">
              {step === 1 ? 'Nạp Token' : 'Thanh Toán'}
            </h2>
            <button
              onClick={handleClose}
              className="text-[#4B5563] hover:text-[#1F2937] transition-colors"
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E88E5] mx-auto"></div>
                  <p className="mt-2 text-[#9CA3AF]">Đang tải danh sách gói...</p>
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
                        ? 'border-[#1E88E5] bg-[#E3F2FD]'
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
                        <h3 className="font-medium text-[#1F2937]">{pkg.package_name}</h3>
                        <p className="text-sm text-[#4B5563] mt-1">
                          {pkg.total_tokens.toLocaleString()} tokens
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#1E88E5]">
                          {pkg.package_price.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-[#4B5563]">
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
              <div className="text-[#1F2937] font-medium">
                Quét mã QR để thanh toán
              </div>
              <div className="p-4 bg-white rounded-xl border-2 border-gray-200 inline-block">
                {loadingQR ? (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E88E5]"></div>
                  </div>
                ) : (
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-48 h-48 object-contain"
                  />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-[#1F2937]">
                  Số tiền: {selectedPackage?.package_price.toLocaleString('vi-VN')}đ
                </div>
                <div className="text-sm text-[#4B5563]">
                  Tokens: {selectedPackage?.total_tokens.toLocaleString()}
                </div>
                {transactionId && (
                  <div className="text-xs text-[#4B5563]">
                    Mã giao dịch: {transactionId}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            {step === 2 ? (
              <>
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded-xl text-[#4B5563] hover:text-[#1F2937] transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleFinishPayment}
                  className="px-6 py-2 rounded-xl bg-[#43A047] text-white transition-colors"
                >
                  Tôi đã thanh toán
                </button>
              </>
            ) : (
              <>
                <div></div>
                {step === 1 && (
                  <button
                    onClick={handleNext}
                    disabled={!selectedPackage}
                    className="px-6 py-2 rounded-xl bg-[#1E88E5] text-white hover:bg-[#42A5F5] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Tiếp tục
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;