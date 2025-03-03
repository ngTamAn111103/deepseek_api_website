import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AccountModal({ isOpen, onClose }) {
  const accountData = {
    balance: {
      topped_up: 1.98,
      granted: 0.00,
      monthly_expenses: 0.01
    },
    usage: {
      api_requests: 114,
      tokens: 31732
    }
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
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-6">
                      Thông tin tài khoản
                    </Dialog.Title>

                    <div className="text-sm text-gray-500 mb-6">
                      Tất cả thời gian được tính theo UTC, và dữ liệu có thể bị trễ tối đa 5 phút.
                    </div>

                    {/* Balance Section */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Số dư nạp</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          ${accountData.balance.topped_up} USD
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Số dư được cấp</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          ${accountData.balance.granted} USD
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Chi phí tháng này</div>
                        <div className="text-2xl font-semibold text-gray-900">
                          ${accountData.balance.monthly_expenses} USD
                        </div>
                      </div>
                    </div>

                    {/* Usage Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Thống kê sử dụng</h4>
                        <button className="btn btn-secondary flex items-center gap-2">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                          Xuất báo cáo
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Số lượng yêu cầu API</span>
                            <span className="text-sm font-medium text-gray-900">{accountData.usage.api_requests}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: '30%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Số token đã sử dụng</span>
                            <span className="text-sm font-medium text-gray-900">{accountData.usage.tokens.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 rounded-full" style={{ width: '50%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
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