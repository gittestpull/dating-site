"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Briefcase, Clock, Crown, Sparkles } from "lucide-react";
import { Profile } from "@/lib/constants";
import Link from "next/link";

interface ProfileCardProps {
  profile: Profile;
  onClick?: () => void;
}

export default function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const isOnline = profile.lastLogin === '접속 중' || profile.lastLogin === 'Just now' || profile.lastLogin === 'Online';
  const isNoble = (profile.matchScore || 0) >= 80 || profile.prestige?.includes('VVIP') || profile.prestige?.includes('CEO') || profile.prestige?.includes('원장');
  const isBlackCard = (profile.assets || 0) >= 3000000000;

  return (
    <Link href={`/matching/${profile.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={onClick}
        className={`group relative cursor-pointer overflow-hidden rounded-[2rem] bg-surface premium-shadow border ${
          isBlackCard 
            ? 'border-gold shadow-[0_0_40px_rgba(212,175,55,0.3)] ring-2 ring-gold/20' 
            : isNoble 
              ? 'border-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
              : 'border-white/5'
        }`}
      >
        {/* Asset Glow Aura for Top Tier */}
        {(isBlackCard || isNoble) && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-64 h-64 bg-gold/20 blur-[100px] rounded-full"
            />
          </div>
        )}

        <div className="aspect-[3/4.5] overflow-hidden relative z-10">
          <Image
            src={profile.image}
            alt={profile.name}
            width={600}
            height={900}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-30" />
          
          {/* Black Card / Noble Match Badge - Floating Top Left */}
          {isBlackCard ? (
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black border-2 border-gold shadow-lg shadow-gold/40">
              <Crown className="h-4 w-4 text-gold" fill="currentColor" />
              <span className="text-[10px] font-black tracking-[0.3em] text-gold uppercase">Black Card Member</span>
            </div>
          ) : isNoble ? (
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold via-gold-light to-gold shadow-lg shadow-gold/20 animate-pulse">
              <Crown className="h-4 w-4 text-black" fill="currentColor" />
              <span className="text-[10px] font-black tracking-[0.2em] text-black uppercase">Noble Match</span>
            </div>
          ) : null}

          {/* Verified Badge - Below Noble or Top Left */}
          {profile.isVerified && !isNoble && (
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-gold/30">
              <ShieldCheck className="h-4 w-4 text-gold" strokeWidth={2.5} />
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase">Verified Member</span>
            </div>
          )}
          
          {profile.isVerified && isNoble && (
            <div className="absolute top-16 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <ShieldCheck className="h-3 w-3 text-gold/60" strokeWidth={2.5} />
              <span className="text-[9px] font-bold tracking-widest text-white/60 uppercase">Verified</span>
            </div>
          )}

          {/* Last Login - Floating Top Right */}
          <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-white/40'}`} />
            <span className="text-[10px] font-medium text-white/80">{profile.lastLogin}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          {/* Identity Section */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-3xl font-bold tracking-tight">
                {profile.name}
              </h3>
              <span className="text-2xl font-light text-white/60">{profile.age}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gold-light/60">
              <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="font-medium">{profile.location}</span>
            </div>
          </div>

          {/* Professionalism Section */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                <Briefcase className="h-4 w-4 text-gold" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">커리어 / 직업</p>
                <p className="text-sm font-medium text-white/90">{profile.prestige || profile.occupation}</p>
              </div>
            </div>
            {profile.education && (
               <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                 <div className="h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white/40">ED</div>
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">학력 및 배경</p>
                 <p className="text-sm font-medium text-white/70">{profile.education}</p>
               </div>
             </div>
            )}
          </div>

          {/* Tags / Interests */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
            {profile.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold tracking-wider text-white/40 uppercase hover:text-gold transition-colors"
              >
                • {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Luxury Border Animation on Hover */}
        <div className="absolute inset-0 border-[1px] border-gold opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-[2rem]" />
      </motion.div>
    </Link>
  );
}
