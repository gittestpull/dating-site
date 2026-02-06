"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Heart, Bell, AlertCircle, X, Sparkles } from "lucide-react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "favorite" | "info" | "warning" | "vip";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const icons = {
  success: CheckCircle,
  favorite: Heart,
  info: Bell,
  warning: AlertCircle,
  vip: Sparkles,
};

const colors = {
  success: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/50",
  favorite: "from-pink-500/20 to-rose-600/20 border-pink-500/50",
  info: "from-blue-500/20 to-indigo-600/20 border-blue-500/50",
  warning: "from-amber-500/20 to-orange-600/20 border-amber-500/50",
  vip: "from-yellow-500/20 to-amber-600/20 border-yellow-500/50",
};

const iconColors = {
  success: "text-emerald-400",
  favorite: "text-pink-400",
  info: "text-blue-400",
  warning: "text-amber-400",
  vip: "text-yellow-400",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`
        relative flex items-center gap-4 px-6 py-4 rounded-2xl
        bg-gradient-to-r ${colors[toast.type]}
        border backdrop-blur-xl shadow-2xl
        min-w-[320px] max-w-[480px]
      `}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors[toast.type]} blur-xl opacity-50 -z-10`} />
      
      <div className={`p-2 rounded-full bg-white/10 ${iconColors[toast.type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <p className="flex-1 text-white font-medium text-sm leading-relaxed">
        {toast.message}
      </p>
      
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
