"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, Edit2, Shield, CreditCard, Award, ChevronRight, Crown, Gem, Zap } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col items-center text-center"
      >
        <div className="relative mb-8">
          <div className="relative h-40 w-40 p-1.5 rounded-full bg-gold-gradient shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#050505]">
              <Image
                src={session?.user?.image || "/profiles/ChaEunwoo_00001_.png"}
                alt="Profile"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-2xl border border-white/20"
          >
            <Edit2 className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">{session?.user?.name || "Chairman"}</h1>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/30">
            <Crown className="h-4 w-4 text-gold" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">VVIP Noblesse</span>
          </div>
          <Link 
            href="/profile/edit"
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:border-gold/30 hover:text-gold transition-all"
          >
            <Edit2 className="h-4 w-4" />
            프로필 정보 수정
          </Link>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-6 mb-16">
        {[
          { icon: Zap, label: "Profile", value: "98%", color: "text-blue-400" },
          { icon: Gem, label: "Prestige", value: "12,405", color: "text-gold" },
          { icon: Crown, label: "Hearts", value: "Unlimited", color: "text-purple-400" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-3 rounded-[2rem] bg-surface p-6 text-center border border-white/5"
          >
            <stat.icon className={`h-5 w-5 ${stat.color} opacity-60`} />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter">{stat.value}</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Membership Account</h2>
            <Link href="/profile/edit" className="text-[10px] font-bold text-gold uppercase underline cursor-pointer">Edit Profile</Link>
          </div>
          <div className="space-y-3">
            <Link href="/profile/edit" className="block w-full">
              <MenuButton icon={Shield} label="Verified Status" value="AUTHENTICATED" isGold />
            </Link>
            <MenuButton icon={CreditCard} label="Exclusive Plan" value="BLACK CARD VVIP" />
            <MenuButton icon={Settings} label="System Settings" />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6 px-4 pt-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Concierge Services</h2>
          </div>
          <div className="space-y-3">
            <MenuButton label="Luxury Venue Reservations" />
            <MenuButton label="VIP Party Invitations" value="2 NEW" isBadge />
            <MenuButton label="1:1 Personal Manager" value="YANG" />
          </div>
        </section>

        <button className="w-full rounded-2xl py-6 text-xs font-bold tracking-[0.3em] text-white/20 uppercase transition-all hover:bg-red-500/5 hover:text-red-500/50 mt-10">
          Sign out session
        </button>
      </div>
    </div>
  );
}

function MenuButton({ 
  icon: Icon, 
  label, 
  value, 
  isGold, 
  isBadge 
}: { 
  icon?: any; 
  label: string; 
  value?: string; 
  isGold?: boolean;
  isBadge?: boolean;
}) {
  return (
    <button className="flex w-full items-center justify-between p-6 rounded-[1.5rem] bg-surface border border-white/5 transition-all hover:border-gold/30 hover:bg-gold/[0.02] group">
      <div className="flex items-center gap-5">
        {Icon && <Icon className={`h-5 w-5 ${isGold ? 'text-gold' : 'text-white/40'}`} />}
        <span className="font-bold text-sm tracking-tight text-white/80 group-hover:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && (
          <span className={`text-[10px] font-bold tracking-widest px-3 py-1 rounded-full ${
            isGold ? 'bg-gold/10 text-gold border border-gold/20' : 
            isBadge ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            'text-white/20'
          }`}>
            {value}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-white/10 group-hover:text-gold" />
      </div>
    </button>
  );
}
