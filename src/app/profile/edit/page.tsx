"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, MapPin, Sparkles, Check, X, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/Toast";

export default function ProfileEditPage() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    age: "",
    location: "",
    occupation: "",
    education: "",
    tags: ""
  });

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/profiles/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            age: data.age?.toString() || "",
            location: data.location || "",
            occupation: data.occupation || "",
            education: data.education || "",
            tags: Array.isArray(data.tags) ? data.tags.join(",") : (data.tags || "")
          });
        });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      showToast("✨ 프로필 수정 신청이 완료되었습니다. VVIP 검수 후 최종 반영됩니다.", "success");
      router.push("/profile");
    } else {
      showToast("⚠️ 수정 중 오류가 발생했습니다.", "warning");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold tracking-tight">프로필 편집</h1>
          <button onClick={() => router.back()} className="text-white/40 hover:text-white transition-all"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group cursor-pointer">
              <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gold/30 p-1">
                <Image 
                  src={session?.user?.image || "/profiles/ChaEunwoo_00001_.png"} 
                  alt="Profile"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover rounded-full group-hover:opacity-50 transition-all" 
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="text-gold" />
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold text-gold uppercase tracking-widest">Change Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">활동명</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-gold/50 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">나이</label>
              <input 
                type="number"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-gold/50 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">거주지</label>
              <input 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-gold/50 outline-none transition-all" 
                placeholder="예: 서울 강남구"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">직업</label>
              <input 
                value={formData.occupation}
                onChange={e => setFormData({...formData, occupation: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-gold/50 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">자기소개</label>
            <textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-gold/50 outline-none transition-all resize-none"
              placeholder="회장님의 멋진 라이프스타일을 공유해주세요."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">관심사 (쉼표로 구분)</label>
            <input 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-gold/50 outline-none transition-all" 
              placeholder="예: 골프, 와인, 여행, 투자"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-2xl border border-white/10 py-5 font-bold hover:bg-white/5 transition-all"
            >
              취소
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-gold-gradient rounded-2xl py-5 text-black font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "저장 중..." : "프로필 저장 및 승인 요청"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
