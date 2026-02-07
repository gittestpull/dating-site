"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/Toast";

interface RevenueSummary {
  total: number;
  completed: number;
  pending: number;
  byType: {
    SUBSCRIPTION: number;
    PREMIUM: number;
    ADDON: number;
  };
}

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RevenueSummary | null;
}

export default function RevenueModal({
  isOpen,
  onClose,
  data,
}: RevenueModalProps) {
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: "SUBSCRIPTION",
    amount: "",
    description: "",
  });

  const handleAdd = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast("❌ 금액을 입력해주세요.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/admin/revenue", {
        method: "POST",
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          description: formData.description,
        }),
      });

      if (res.ok) {
        showToast("✅ 매출 기록이 추가되었습니다.", "success");
        setFormData({ type: "SUBSCRIPTION", amount: "", description: "" });
        setIsAdding(false);
        // Refresh data could be done via callback
      } else {
        showToast("❌ 추가 실패", "warning");
      }
    } catch (error) {
      console.error(error);
      showToast("❌ 오류가 발생했습니다.", "warning");
    }
  };

  if (!isOpen || !data) return null;

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString("ko-KR")}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold">매출 대시보드</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              총 매출
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {formatCurrency(data.total)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              확정 매출
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">
              {formatCurrency(data.completed)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-4"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              대기 중
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
              {formatCurrency(data.pending)}
            </p>
          </motion.div>
        </div>

        {/* Revenue by Type */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            매출 분류
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-600">
              <span className="text-gray-700 dark:text-gray-300">
                구독료 (Subscription)
              </span>
              <span className="font-semibold">
                {formatCurrency(data.byType.SUBSCRIPTION)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-600">
              <span className="text-gray-700 dark:text-gray-300">
                프리미엄 (Premium)
              </span>
              <span className="font-semibold">
                {formatCurrency(data.byType.PREMIUM)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                애드온 (Addon)
              </span>
              <span className="font-semibold">
                {formatCurrency(data.byType.ADDON)}
              </span>
            </div>
          </div>
        </div>

        {/* Add Revenue Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <h3 className="font-semibold mb-4">매출 추가</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  분류
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border dark:bg-gray-600 dark:border-gray-500 rounded-lg"
                >
                  <option value="SUBSCRIPTION">구독료</option>
                  <option value="PREMIUM">프리미엄</option>
                  <option value="ADDON">애드온</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  금액 (₩)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border dark:bg-gray-600 dark:border-gray-500 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="매출 설명"
                  className="w-full px-3 py-2 border dark:bg-gray-600 dark:border-gray-500 rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                  추가
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            {isAdding ? "입력 취소" : "+ 매출 추가"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
