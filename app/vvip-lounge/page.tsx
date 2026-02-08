"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, Star, Gem, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/Toast";

export default function VVIPLounge() {
  const { showToast } = useToast();
  const [vvipMembers, setVvipMembers] = useState<any[]>([]);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/profiles")
      .then(res => res.json())
      .then(data => setVvipMembers(data.slice(0, 3)));
  }, []);

  const handlePartyBooking = () => {
    setIsPartyModalOpen(false);
    showToast("🎉 파티 예약 신청이 완료되었습니다! 담당 매니저가 연락드릴 예정입니다.", "success");
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Crown className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Members Only</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            VVIP <span className="text-gold-gradient">LOUNGE</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            대한민국 상위 1%만을 위한 프라이빗 커뮤니티 공간입니다.<br />
            엄격한 자산 및 직업 인증을 통과한 분들께만 허락된 특별한 만남을 경험하세요.
          </p>
        </motion.div>

        {/* Featured Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[500px] rounded-[3rem] overflow-hidden premium-shadow border border-gold/20 group"
          >
            <Image 
              src="/profiles/Luxury_Fashion_1_00001_.png" 
              alt="Featured" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="text-xs font-bold tracking-widest text-gold uppercase">이달의 추천 멤버</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">프리미엄 셀렉션</h2>
              <p className="text-white/70 mb-6">GOLDRUSH가 선정한 이번 달 가장 영향력 있는 VVIP 멤버를 소개합니다.</p>
              <Link 
                href="/matching"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm transition-all hover:bg-gold hover:scale-105"
              >
                프로필 보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface rounded-[2rem] p-8 border border-white/5 flex items-center gap-8 group hover:border-gold/30 transition-all"
            >
              <div className="h-20 w-20 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 transition-all group-hover:bg-gold/20">
                <Gem className="h-10 w-10 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">프라이빗 파티 초대</h3>
                <p className="text-white/40 text-sm">매달 오프라인에서 열리는 최고급 사교 파티와 네트워킹 행사에 참여하실 수 있습니다.</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              className="bg-surface rounded-[2rem] p-8 border border-white/5 flex items-center gap-8 group hover:border-gold/30 transition-all"
            >
              <div className="h-20 w-20 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 transition-all group-hover:bg-gold/20">
                <Sparkles className="h-10 w-10 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI 전담 매니징</h3>
                <p className="text-white/40 text-sm">양비서 AI가 회장님의 취향을 완벽히 분석하여 최고의 파트너를 1:1로 매칭해드립니다.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section for Party */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 p-12 rounded-[3rem] bg-gold-gradient text-black flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Private Mansion Party</h2>
            <p className="font-medium opacity-70">청담동 프라이빗 맨션에서 열리는 최고급 사교 파티에 초대합니다. (정원 20명)</p>
          </div>
          <button 
            onClick={() => setIsPartyModalOpen(true)}
            className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
          >
            지금 예약하기
          </button>
        </motion.div>

        {/* Members Grid Section */}
        <div className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-2">Exclusive Members</p>
              <h2 className="text-4xl font-bold">VVIP 멤버 리스트</h2>
            </div>
            <button className="text-white/40 text-sm font-bold hover:text-gold transition-colors">전체 보기</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vvipMembers.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                className="group relative h-[400px] rounded-[2rem] overflow-hidden border border-white/10"
              >
                <Image 
                  src={profile.image} 
                  alt={profile.name} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[10px] font-bold tracking-widest text-gold uppercase mb-1">{profile.occupation || "VERIFIED MEMBER"}</p>
                  <h3 className="text-2xl font-bold">{profile.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        title="파티 예약 안내"
      >
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Crown className="h-10 w-10 text-gold" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold mb-2">프라이빗 맨션 파티 신청</p>
            <p className="text-sm text-white/40">본 파티는 철저한 신원 및 자산 검증을 거친 정회원만 참석 가능합니다. 신청 시 담당 매니저가 유선으로 최종 승인 절차를 도와드립니다.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">일시</span>
              <span className="text-white font-medium">2026년 2월 21일 (토) 19:00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">장소</span>
              <span className="text-white font-medium">청담동 소재 프라이빗 펜트하우스</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">참가비</span>
              <span className="text-gold font-bold">별도 문의 (Prestige 등급 우대)</span>
            </div>
          </div>
          <button 
            onClick={handlePartyBooking}
            className="w-full py-5 rounded-2xl bg-gold-gradient text-black font-black tracking-widest uppercase shadow-lg shadow-gold/20 hover:scale-[1.02] transition-all"
          >
            신청하기
          </button>
        </div>
      </Modal>
    </div>
  );
}
