"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, Car, FileText, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s ? 'bg-gold border-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-background border-white/20 text-white/40'
              }`}
            >
              {step > s ? <CheckCircle className="h-5 w-5" /> : <span className="font-bold">{s}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface rounded-[3rem] p-10 border border-white/5"
            >
              <h2 className="text-3xl font-bold mb-2">기본 정보 입력</h2>
              <p className="text-white/40 mb-8">GOLDRUSH 멤버십을 위한 기초 정보를 입력해 주세요.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">이름</label>
                  <input type="text" placeholder="성함을 입력하세요" className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-gold/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">이메일</label>
                  <input type="email" placeholder="example@email.com" className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-gold/50" />
                </div>
                <button onClick={nextStep} className="w-full bg-gold-gradient py-5 rounded-2xl text-black font-bold flex items-center justify-center gap-2 mt-8">
                  다음 단계로 <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-surface rounded-[3rem] p-10 border border-gold/20"
            >
              <h2 className="text-3xl font-bold mb-2 text-gold">자산 인증</h2>
              <p className="text-white/40 mb-8">VVIP 멤버십 승인을 위해 자산 증빙 서류를 업로드해 주세요.</p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-gold/30 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                      <Car className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold">차량 등록증</p>
                      <p className="text-xs text-white/40">수입차 및 슈퍼카 소유주 필수</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gold uppercase tracking-widest">Upload</div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-gold/30 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold">소득 증빙 서류</p>
                      <p className="text-xs text-white/40">근로소득원천징수 등 (1억 이상)</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gold uppercase tracking-widest">Upload</div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={prevStep} className="flex-1 border border-white/10 py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2">
                    <ArrowLeft className="h-5 w-5" /> 이전
                  </button>
                  <button onClick={nextStep} className="flex-[2] bg-gold-gradient py-5 rounded-2xl text-black font-bold flex items-center justify-center gap-2">
                    인증 신청하기 <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface rounded-[3rem] p-12 border border-gold/50 text-center"
            >
              <div className="h-24 w-24 rounded-full bg-gold/20 flex items-center justify-center text-gold mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold mb-4">가입 신청 완료</h2>
              <p className="text-white/50 mb-10 text-lg">회장님의 정보가 성공적으로 접수되었습니다.<br />양비서의 엄격한 심사 후 24시간 내에 연락드리겠습니다.</p>
              <button onClick={() => router.push('/')} className="w-full bg-gold-gradient py-5 rounded-2xl text-black font-bold text-lg">
                메인으로 돌아가기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
