'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (paymentData: any) => void;
  userId?: string;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, userId }: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(49000); // 기본값: 49,000원
  const [productName, setProductName] = useState<string>('Premium Membership');
  const [selectedUserId, setSelectedUserId] = useState<string>(userId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePaymentRequest = async () => {
    if (!selectedUserId) {
      setError('User ID를 입력해주세요');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. 결제 요청 API 호출
      const requestRes = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          amount,
          productName,
          productDescription: 'GoldRush Premium Features',
        }),
      });

      if (!requestRes.ok) {
        throw new Error('Failed to create payment request');
      }

      const { merchantUid, paymentId } = await requestRes.json();

      // 2. PortOne 결제창 열기 (테스트 모드)
      // 실제 환경에서는 PortOne의 JavaScript SDK 사용
      const imp_uid = `test_${Date.now()}`;

      // 3. 결제 확인 API 호출
      const confirmRes = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impUid: imp_uid,
          merchantUid,
        }),
      });

      if (!confirmRes.ok) {
        throw new Error('Payment confirmation failed');
      }

      const confirmData = await confirmRes.json();

      if (confirmData.success) {
        setSuccess(true);
        setAmount(49000);
        setProductName('Premium Membership');
        setSelectedUserId('');
        
        setTimeout(() => {
          onPaymentComplete?.(confirmData);
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(confirmData.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-500">💳 결제 처리</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-500 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="bg-green-900/20 border border-green-600 rounded p-4 mb-4 text-center">
            <p className="text-green-400 font-bold">✅ 결제가 완료되었습니다!</p>
            <p className="text-green-400 text-sm mt-2">₩{amount.toLocaleString()}</p>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded p-3 mb-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* User ID Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                사용자 ID
              </label>
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="User ID를 입력하세요"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-500 outline-none"
              />
            </div>

            {/* Product Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상품 선택
              </label>
              <select
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (e.target.value === 'Premium Membership') setAmount(49000);
                  else if (e.target.value === 'VIP Membership') setAmount(99000);
                  else if (e.target.value === 'Elite Membership') setAmount(199000);
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-yellow-500 outline-none"
              >
                <option value="Premium Membership">Premium Membership - ₩49,000</option>
                <option value="VIP Membership">VIP Membership - ₩99,000</option>
                <option value="Elite Membership">Elite Membership - ₩199,000</option>
              </select>
            </div>

            {/* Amount Display */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">결제 금액</p>
              <p className="text-4xl font-bold text-yellow-500">
                ₩{amount.toLocaleString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                취소
              </button>
              <button
                onClick={handlePaymentRequest}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-2 rounded-lg transition"
              >
                {isLoading ? '처리 중...' : '결제하기'}
              </button>
            </div>

            {/* Info */}
            <p className="text-gray-500 text-xs mt-4 text-center">
              💡 테스트 모드: 실제 결제가 발생하지 않습니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
