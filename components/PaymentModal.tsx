'use client';

import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (paymentData: any) => void;
  userId: string;
}

export default function PaymentModal({ isOpen, onClose, onPaymentComplete, userId }: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(49000); // 기본값: 49,000원
  const [productName, setProductName] = useState<string>('Premium Membership');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentRequest = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. 결제 요청 API 호출
      const requestRes = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
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
        setAmount(49000);
        setProductName('Premium Membership');
        onPaymentComplete?.(confirmData);
        onClose();
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
      <div className="bg-gray-900 border border-gold rounded-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gold">💳 결제하기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gold transition"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded p-3 mb-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Product Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            상품 선택
          </label>
          <select
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              // 상품에 따라 금액 변경
              if (e.target.value === 'Premium Membership') setAmount(49000);
              else if (e.target.value === 'VIP Membership') setAmount(99000);
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-gold outline-none"
          >
            <option value="Premium Membership">Premium Membership - ₩49,000</option>
            <option value="VIP Membership">VIP Membership - ₩99,000</option>
          </select>
        </div>

        {/* Amount Display */}
        <div className="bg-gray-800 rounded p-4 mb-6">
          <p className="text-gray-400 text-sm mb-1">결제 금액</p>
          <p className="text-3xl font-bold text-gold">
            ₩{amount.toLocaleString()}
          </p>
        </div>

        {/* User ID (Info) */}
        <div className="bg-gray-800 rounded p-3 mb-6">
          <p className="text-gray-400 text-xs mb-1">사용자 ID</p>
          <p className="text-gray-200 text-sm font-mono">{userId}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-2 rounded transition"
          >
            취소
          </button>
          <button
            onClick={handlePaymentRequest}
            disabled={isLoading}
            className="flex-1 bg-gold hover:bg-yellow-500 disabled:opacity-50 text-black font-bold py-2 rounded transition"
          >
            {isLoading ? '처리 중...' : '결제하기'}
          </button>
        </div>

        {/* Info */}
        <p className="text-gray-500 text-xs mt-4 text-center">
          💡 테스트 모드: 실제 결제가 발생하지 않습니다.
        </p>
      </div>
    </div>
  );
}
