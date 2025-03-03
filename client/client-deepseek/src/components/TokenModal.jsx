import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PACKAGES = [
  {
    id: 'small',
    name: 'Gói nhỏ',
    tokens: 100000,
    pricePerToken: 0.1,
    description: 'Phù hợp cho người dùng mới',
    discount: 0,
    price: 10000, // 10,000 VNĐ
  },
  {
    id: 'medium',
    name: 'Gói trung bình',
    tokens: 600000,
    pricePerToken: 0.09,
    description: 'Khuyến khích mua nhiều',
    discount: 10,
    price: 54000, // Giảm 10% từ 60,000 VNĐ
  },
  {
    id: 'large',
    name: 'Gói lớn',
    tokens: 1250000,
    pricePerToken: 0.08,
    description: 'Dành cho khách hàng thường xuyên',
    discount: 20,
    price: 100000, // Giảm 20% từ 125,000 VNĐ
  },
];

export default function TokenModal({ isOpen, onClose }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showQR, setShowQR] = useState(false);

  // Đặt gói trung bình làm mặc định khi modal mở
  useEffect(() => {
    if (isOpen) {
      const mediumPackage = PACKAGES.find(pkg => pkg.id === 'medium');
      setSelectedPackage(mediumPackage);
    } else {
      setSelectedPackage(null);
      setShowQR(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedPackage) return;
    setShowQR(true);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                      Nạp Token
                    </Dialog.Title>
                    
                    {!showQR ? (
                      <>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          {PACKAGES.map((pkg) => (
                            <div
                              key={pkg.id}
                              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                                selectedPackage?.id === pkg.id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-300 hover:border-primary-300'
                              }`}
                              onClick={() => setSelectedPackage(pkg)}
                            >
                              {selectedPackage?.id === pkg.id && (
                                <CheckCircleIcon className="absolute -right-2 -top-2 h-6 w-6 text-primary-500" />
                              )}
                              <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                              <div className="mt-1 text-sm text-gray-500">
                                {pkg.tokens.toLocaleString()} token
                              </div>
                              {pkg.discount > 0 && (
                                <div className="mt-1 text-xs text-green-600">
                                  Giảm {pkg.discount}%
                                </div>
                              )}
                              <div className="mt-2 text-lg font-medium text-gray-900">
                                {pkg.price.toLocaleString()} VNĐ
                              </div>
                              {pkg.discount > 0 && (
                                <div className="mt-1 text-xs text-gray-500 line-through">
                                  {Math.round(pkg.price / (1 - pkg.discount / 100)).toLocaleString()} VNĐ
                                </div>
                              )}
                              <p className="mt-1 text-xs text-gray-500">{pkg.description}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="button"
                            className="btn btn-primary w-full sm:ml-3 sm:w-auto"
                            onClick={handleSubmit}
                            disabled={!selectedPackage}
                          >
                            Thanh toán
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-4 text-center">
                        <div className="mx-auto w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCodeIcon className="h-32 w-32 text-gray-400" />
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                          Quét mã QR để thanh toán {selectedPackage.tokens.toLocaleString()} token
                          <br />
                          Số tiền: {selectedPackage.price.toLocaleString()} VNĐ
                        </p>
                        <button
                          type="button"
                          className="btn btn-secondary mt-4"
                          onClick={() => setShowQR(false)}
                        >
                          Quay lại
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 