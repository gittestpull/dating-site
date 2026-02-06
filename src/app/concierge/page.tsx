"use client";

import { motion } from "framer-motion";
import { Shield, Send, Phone, Calendar, Info, CheckCircle2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/ui/Modal";

export default function ConciergePage() {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { 
      role: "manager", 
      text: "안녕하십니까, 회장님. GoldRush 프라이빗 매칭 담당 양비서입니다.",
      time: "10:00 AM"
    },
    { 
      role: "manager", 
      text: "회장님만을 위한 프리미엄 매칭 데이터 분석이 완료되었습니다. 오늘 추천드리는 3분의 멤버는 회장님의 취향과 자산 규모를 고려하여 엄선하였습니다. 상세 내용을 확인해보시겠습니까?",
      time: "10:01 AM"
    }
  ]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      role: "user",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newMsg]);
    setMessage("");

    // Simulate Secretary Yang's response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: "manager",
        text: "회장님, 메시지 확인했습니다. 요청하신 사항은 즉시 검토하여 1:1 상담으로 안내해 드리겠습니다. 더 필요한 것이 있으시면 언제든 말씀해 주십시오!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const handleVerifySubmit = async (type: string) => {
    showToast(`${type} 서류를 전송 중입니다...`, "info");
    
    // Simulate API call
    setTimeout(() => {
      showToast("🛡️ 서류 접수 완료! 24시간 내에 VVIP 승인이 완료됩니다.", "success");
      setActiveModal(null);
    }, 1500);
  };

  const handleBookingSubmit = () => {
    showToast("📅 일정 예약 신청이 접수되었습니다. 매니저가 연락드리겠습니다.", "success");
    setActiveModal(null);
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Info */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`w-full md:w-96 border-r border-white/5 p-8 flex flex-col ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}
      >
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gold-gradient rounded-full blur-md opacity-20 animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-gold p-1 overflow-hidden">
              <Image 
                src="/profiles/ChaEunwoo_00001_.png" 
                alt="Manager" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 h-4 w-4 rounded-full border-4 border-background" />
          </div>
          <h2 className="text-2xl font-bold mb-1">양비서</h2>
          <p className="text-gold text-xs font-bold tracking-widest uppercase mb-4">Senior Concierge Manager</p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">VIP 전담</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40">연중무휴</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Exclusive Services</p>
          <button 
            onClick={() => setActiveModal('calendar')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-gold/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gold" />
              </div>
              <span className="font-bold text-sm">프라이빗 일정 예약</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-gold/40 group-hover:text-gold" />
          </button>
          
          <button 
            onClick={() => {
              showToast("📱 전담 매니저와 1:1 채팅 모드로 전환합니다.", "vip");
              setShowChatOnMobile(true);
            }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-gold/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-gold" />
              </div>
              <span className="font-bold text-sm">1:1 밀착 상담</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-gold/40 group-hover:text-gold" />
          </button>

          <button 
            onClick={() => setActiveModal('shield')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-gold/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-gold" />
              </div>
              <span className="font-bold text-sm">신원 보증 서비스</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-gold/40 group-hover:text-gold" />
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-gold/5 border border-gold/10">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Manager Note</span>
          </div>
          <p className="text-[11px] text-gold-light/60 leading-relaxed">회장님의 선호도를 분석한 결과, 현재 매칭 만족도가 92%로 매우 높게 나타나고 있습니다.</p>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className={`${showChatOnMobile ? 'flex' : 'hidden'} flex-1 flex-col bg-[#080808] md:flex`}>
        <div className="h-20 border-b border-white/5 px-6 md:px-8 flex items-center justify-between bg-surface/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowChatOnMobile(false)}
              className="md:hidden h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h3 className="text-lg font-bold">Private 1:1 상담</h3>
            <span className="px-2 py-0.5 rounded bg-gold/20 text-[9px] font-bold text-gold uppercase tracking-tighter">Direct Line</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveModal('phone')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setActiveModal('info')}
              className="text-white/40 hover:text-white transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {chatMessages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.2 } }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                <div className={`p-4 md:p-5 rounded-[1.5rem] ${
                  msg.role === 'user' 
                    ? 'bg-gold text-black font-medium rounded-tr-none' 
                    : 'bg-surface border border-white/10 text-white/90 leading-relaxed rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <p className={`mt-2 text-[10px] text-white/20 font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-surface/5 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="양비서에게 메시지 남기기..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all text-sm"
            />
            <button 
              type="submit"
              className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gold-gradient flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'calendar'} 
        onClose={() => setActiveModal(null)}
        title="프라이빗 일정 예약"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <Calendar className="h-16 w-16 text-gold mb-6 opacity-40" />
            <p>회장님을 위한 맞춤형 만남을 설계해 드립니다.</p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 mb-2">선호 지역</p>
              <input type="text" placeholder="예: 청담동, 한남동" className="w-full bg-transparent border-none outline-none text-sm" />
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 mb-2">예상 일시</p>
              <input type="datetime-local" className="w-full bg-transparent border-none outline-none text-sm text-white invert" />
            </div>
          </div>
          
          <p className="text-center text-xs text-white/40 mt-2">※ 양비서가 직접 검증된 파트너와 스케줄을 조율합니다.</p>
          <button 
            onClick={handleBookingSubmit}
            className="w-full py-4 rounded-2xl bg-gold-gradient text-black font-bold tracking-widest uppercase hover:scale-[1.02] transition-all"
          >
            예약 신청하기
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'shield'} 
        onClose={() => setActiveModal(null)}
        title="프리미엄 신원 인증"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-16 w-16 text-gold mb-6 opacity-40" />
            <p>상위 1%를 위한 신뢰의 상징, 노블레스 배지.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleVerifySubmit('자산')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 text-left transition-all"
            >
              <h4 className="font-bold text-sm mb-1">자산 인증</h4>
              <p className="text-[10px] text-white/40">금융거래확인서 등</p>
            </button>
            <button 
              onClick={() => handleVerifySubmit('직업')}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 text-left transition-all"
            >
              <h4 className="font-bold text-sm mb-1">직업 인증</h4>
              <p className="text-[10px] text-white/40">전문직 자격증 등</p>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 text-center">
            <p className="text-xs text-gold">제출하신 서류는 심사 후 24시간 내에 파기됩니다.</p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'phone'} 
        onClose={() => setActiveModal(null)}
        title="직통 라인 연결"
      >
        <div className="flex flex-col items-center text-center">
          <Phone className="h-16 w-16 text-gold mb-6 opacity-40" />
          <p>회장님 전용 직통 라인으로 연결하시겠습니까?</p>
          <p className="mt-4 text-xl font-bold tracking-tighter text-white">010-XXXX-XXXX</p>
          <p className="mt-2 text-xs text-white/40">※ 전담 매니저가 24시간 대기 중입니다.</p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'info'} 
        onClose={() => setActiveModal(null)}
        title="컨시어지 서비스 가이드"
      >
        <div className="text-left space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white mb-1">1:1 밀착 케어</h4>
            <p className="text-xs text-white/50">전담 매니저가 회장님의 취향을 학습하여 최적의 파트너를 제안합니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white mb-1">일정 관리</h4>
            <p className="text-xs text-white/50">데이트 코스 추천부터 예약까지 모든 번거로움을 대신 처리해 드립니다.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white mb-1">프라이버시 보호</h4>
            <p className="text-xs text-white/50">모든 상담 내용은 암호화되어 보호되며, 회장님의 개인정보는 철저히 관리됩니다.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
