"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { login, signUp } from "@/lib/actions";
import { useToast } from "@/components/Toast";

export default function AuthPage() {
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (isLogin) {
        const result = await login(formData);
        if (result?.error) {
          setError(result.error);
          showToast(result.error, "warning");
        } else {
          // [2026-02-09] 수정: 로그인 성공 시 명시적 리다이렉트 + 새로고침
          // 원본: 리다이렉트 처리 없음 (signIn의 redirectTo에 의존)
          // 수정 이유: useTransition 내에서 서버 리다이렉트가 제대로 작동하지 않음
          showToast("✨ 로그인 성공!", "success");
          router.refresh();
          router.push("/");
        }
      } else {
        const result = await signUp(formData);
        if (result.error) {
          setError(result.error);
          showToast(result.error, "warning");
        } else {
          setIsLogin(true);
          showToast("✨ 가입이 완료되었습니다. 로그인해주세요.", "success");
        }
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
            <Heart className="h-10 w-10 text-gold fill-gold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {isLogin ? "환영합니다" : "GOLDRUSH 가입"}
          </h1>
          <p className="mt-2 text-white/50">
            {isLogin 
              ? "상위 1%를 위한 프리미엄 매칭 서비스" 
              : "엄격한 심사를 거쳐 GOLDRUSH의 일원이 되세요"}
          </p>
        </div>

        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-surface p-8 shadow-2xl"
        >
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">이름</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    name="name"
                    type="text"
                    placeholder="홍길동"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">이메일</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">비밀번호</label>
                {isLogin && (
                  <button className="text-xs text-gold hover:underline" type="button">비밀번호 찾기</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="bg-gold-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "처리 중..." : (isLogin ? "로그인" : "가입 신청하기")}
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/50">
              {isLogin ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-gold hover:underline"
              >
                {isLogin ? "회원가입" : "로그인"}
              </button>
            </p>
          </div>
        </motion.div>

        <div className="mt-12 text-center text-xs text-white/30">
          <p>© 2026 GOLDRUSH Private Matching Service. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
