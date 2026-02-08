"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, MapPin, Briefcase, Heart, MessageCircle, Star, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [show3D, setShow3D] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/profiles/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => {
        console.error(err);
        setProfile({ name: "Unknown", error: true });
      });

    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIsFavorited(data.includes(id!));
        }
      });
  }, [id]);

  const toggleFavorite = async () => {
    if (!id) return;
    const res = await fetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ targetId: id }),
    });
    const data = await res.json();
    if (data.status === "added") {
      setIsFavorited(true);
      showToast("💖 관심 멤버로 등록되었습니다!", "favorite");
    } else {
      setIsFavorited(false);
      showToast("관심 멤버에서 해제되었습니다.", "info");
    }
  };

  if (!profile) return <div className="p-20 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <button 
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="px-4 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-2">
          <Crown className="h-3 w-3 text-gold" />
          <span className="text-[10px] font-bold text-gold tracking-widest uppercase">Elite Member</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Image Section */}
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute top-24 right-6 z-20">
            <button 
              onClick={() => setShow3D(!show3D)}
              className={`px-6 py-3 rounded-full border text-xs font-bold tracking-widest uppercase transition-all shadow-2xl ${show3D ? 'bg-gold text-black border-gold' : 'bg-black/60 text-gold border-gold/30 backdrop-blur-xl'}`}
            >
              {show3D ? 'Show Photo' : 'View 3D'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {show3D ? (
              <motion.div
                key="3d-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full bg-[#050505]"
                dangerouslySetInnerHTML={{
                  __html: `<model-viewer src="/3d_model.glb" alt="3D Profile Model" auto-rotate camera-controls style="width: 100%; height: 100%;"></model-viewer>`
                }}
              />
            ) : (
              <motion.div
                key="photo-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Image 
                  src={profile.image} 
                  alt={profile.name} 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <div className="px-6 -mt-32 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-[3rem] p-10 border border-white/5 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-5xl font-bold">{profile.name}</h1>
                  <span className="text-4xl font-light text-white/40">{profile.age || 25}</span>
                  <ShieldCheck className="h-6 w-6 text-gold" />
                </div>
                <div className="flex items-center gap-3 text-white/40 font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location || "서울 강남구"}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                 <button 
                  onClick={toggleFavorite}
                  className={`h-16 w-16 rounded-2xl border flex items-center justify-center transition-all ${isFavorited ? 'bg-gold text-black border-gold' : 'bg-white/5 border-white/10 text-gold hover:bg-gold hover:text-black'}`}
                 >
                    <Star className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} strokeWidth={2.5} />
                 </button>
                 <button 
                  onClick={() => router.push('/messages')}
                  className="h-16 px-8 rounded-2xl bg-gold-gradient text-black font-bold flex items-center gap-3 hover:scale-105 transition-all"
                 >
                    <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                    대화 시작하기
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold text-gold tracking-[0.3em] uppercase mb-4">About Me</h3>
                  <p className="text-lg text-white/70 leading-relaxed">{profile.bio || "GOLDRUSH의 특별한 멤버입니다."}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gold tracking-[0.3em] uppercase">Interests</h3>
                  <div className="flex flex-wrap gap-3">
                    {(profile.tags || ["럭셔리", "여행", "예술"]).map((tag: string) => (
                      <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/5 text-sm font-medium text-white/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xs font-bold text-white/40 tracking-[0.3em] uppercase">Verified Info</h3>
                
                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-gold" />
                   </div>
                   <div>
                      <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Occupation</p>
                      <p className="text-lg font-bold">{profile.occupation || "전문직"}</p>
                   </div>
                </div>

                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-white/40" />
                   </div>
                   <div>
                      <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Prestige</p>
                      <p className="text-lg font-bold">{profile.prestige || "GOLD"}</p>
                   </div>
                </div>

                <div className="flex items-center gap-5">
                   <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                      <div className="text-xs font-bold text-white/40">ED</div>
                   </div>
                   <div>
                      <p className="text-xs text-white/30 uppercase font-bold tracking-widest">Education</p>
                      <p className="text-lg font-bold">{profile.education || "국내 명문대 졸업"}</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
