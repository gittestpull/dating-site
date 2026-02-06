"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, RotateCcw, Crown, Filter, Star, Users } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MatchingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveUsers, setLiveUsers] = useState(1248);
  const [show3D, setShow3D] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showMatchSuccess, setShowMatchSuccess] = useState(false);
  const { data: session } = useSession();

  const handleNext = () => {
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    fetch("/api/profiles")
      .then(res => res.json())
      .then(data => setProfiles(data))
      .catch(err => console.error("Matching load error:", err));

    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => setFavorites(Array.isArray(data) ? data : []))
      .catch(err => console.error("Favorites load error:", err));
  }, []);

  const toggleFavorite = async (targetId: string) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ targetId }),
    });
    const data = await res.json();
    if (data.status === "added") {
      setFavorites(prev => [...prev, targetId]);
    } else if (data.status === "removed") {
      setFavorites(prev => prev.filter(id => id !== targetId));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMatch = async () => {
    if (!currentProfile || !session?.user?.id) return;
    
    await fetch("/api/matches/create", {
      method: "POST",
      body: JSON.stringify({ targetUserId: currentProfile.id }),
    });

    setShowMatchSuccess(true);
    setTimeout(() => {
      setShowMatchSuccess(false);
      handleNext();
    }, 2000);
  };

  const filteredProfiles = showOnlyFavorites 
    ? profiles.filter(p => favorites.includes(p.id))
    : profiles;

  const currentProfile = filteredProfiles[currentIndex];

  if (profiles.length === 0) return <div className="p-20 text-center">Loading selection...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8 pb-24 px-4 overflow-hidden">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg flex items-center justify-between mb-10"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
            <Crown className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Today's Selection</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">{liveUsers.toLocaleString()} Live</span>
              </div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{showOnlyFavorites ? 'Favorites Only' : 'Premium Curated'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setShowOnlyFavorites(!showOnlyFavorites);
            setCurrentIndex(0);
          }}
          className={`h-12 w-12 rounded-2xl bg-surface border flex items-center justify-center transition-all ${showOnlyFavorites ? 'border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-white/5 text-white/40 hover:text-gold'}`}
        >
          <Filter className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Match Success Overlay */}
      <AnimatePresence>
        {showMatchSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gold-gradient p-1 shadow-[0_0_50px_rgba(212,175,55,0.8)]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                    <Heart className="h-16 w-16 fill-gold text-gold animate-pulse stroke-[2px]" />
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gold mb-2">MATCH SUCCESS!</h2>
              <p className="text-white/60 text-lg">상대방에게 매칭 신청을 보냈습니다.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Container */}
      <div className="relative w-full max-w-lg aspect-[3/4.5] mb-12">
        {filteredProfiles.length > 0 ? (
          <>
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setShow3D(!show3D)}
                className={`px-4 py-2 rounded-full border text-[10px] font-bold tracking-widest uppercase transition-all ${show3D ? 'bg-gold text-black border-gold' : 'bg-black/40 text-gold border-gold/30 backdrop-blur-md'}`}
              >
                {show3D ? 'View Photo' : 'View 3D'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {show3D ? (
                <motion.div
                  key="3d-viewer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full rounded-[2rem] overflow-hidden bg-surface border border-gold/20"
                  dangerouslySetInnerHTML={{
                    __html: `<model-viewer src="/3d_model.glb" alt="3D Profile Model" auto-rotate camera-controls style="width: 100%; height: 100%; background: #0a0a0a;"></model-viewer>`
                  }}
                />
              ) : (
                <motion.div
                  key={currentProfile.id}
                  initial={{ opacity: 0, scale: 0.9, x: 100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.1, x: -100 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-full h-full"
                >
                  <ProfileCard profile={currentProfile} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Swipe Indicators - Luxury Glass Style */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
              <div className="text-[10px] font-bold text-white/20 uppercase vertical-text tracking-[0.5em] mb-4">DISLIKE</div>
              <button 
                onClick={handleNext}
                className="h-16 w-16 rounded-full bg-surface border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/50 transition-all hover:scale-110"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
              <div className="text-[10px] font-bold text-gold/40 uppercase vertical-text tracking-[0.5em] mb-4">MATCH</div>
              <button 
                onClick={handleMatch}
                className="h-16 w-16 rounded-full bg-gold-gradient flex items-center justify-center text-black hover:scale-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <Heart className="h-8 w-8 fill-black stroke-black stroke-2" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface rounded-[2rem] border border-white/5 p-12 text-center">
            <Star className="h-16 w-16 text-gold/20 mb-6" />
            <h2 className="text-2xl font-bold mb-4">즐겨찾기 멤버가 없습니다</h2>
            <p className="text-white/40 mb-8">관심있는 프로필에서 별 버튼을 눌러 즐겨찾기에 추가해보세요.</p>
            <button 
              onClick={() => setShowOnlyFavorites(false)}
              className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all"
            >
              전체 멤버 보기
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons for Mobile/Standard */}
      {filteredProfiles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => setCurrentIndex(0)}
              className="h-14 w-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all"
              title="처음부터 다시보기"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Rewind</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleNext}
              className="h-20 w-20 rounded-3xl bg-surface border border-white/10 flex items-center justify-center text-white/60 hover:text-red-500 hover:border-red-500/50 transition-all hover:scale-110 active:scale-95"
              title="관심 없음"
            >
              <X className="h-10 w-10" />
            </button>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pass</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={handleMatch}
              className="h-24 w-24 rounded-[2.5rem] bg-gold-gradient flex items-center justify-center text-black shadow-[0_10px_30px_rgba(212,175,55,0.6)] transition-all hover:scale-110 active:scale-95"
              title="매칭 신청"
            >
              <Heart className="h-12 w-12 fill-black stroke-black stroke-[3px]" />
            </button>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Match</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => toggleFavorite(currentProfile.id)}
              className={`h-14 w-14 rounded-2xl bg-surface border flex items-center justify-center transition-all ${favorites.includes(currentProfile.id) ? 'border-gold text-gold bg-gold/5' : 'border-white/5 text-white/40 hover:text-purple-400'}`}
              title="즐겨찾기"
            >
              <Star className={`h-6 w-6 ${favorites.includes(currentProfile.id) ? 'fill-current' : ''}`} />
            </button>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Fav</span>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
