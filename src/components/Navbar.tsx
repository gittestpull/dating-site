"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, User, Search, MessageCircle, Crown, Shield } from "lucide-react";

import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "DISCOVER", icon: Search },
  { href: "/matching", label: "MATCH", icon: Heart },
  { href: "/vvip-lounge", label: "LOUNGE", icon: Crown },
  { href: "/concierge", label: "CONCIERGE", icon: Shield },
  { href: "/messages", label: "CHAT", icon: MessageCircle },
  { href: "/profile", label: "MY PAGE", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/90 backdrop-blur-2xl md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="hidden items-center gap-3 md:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-gradient premium-shadow">
            <Crown className="h-6 w-6 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-[0.2em] text-gold-gradient uppercase">
              GOLDRUSH
            </span>
            <span className="text-[8px] tracking-[0.4em] text-white/40 uppercase">
              Privé Noblesse
            </span>
          </div>
        </Link>

        <div className="flex w-full items-center justify-around md:w-auto md:justify-end md:gap-10">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all hover:scale-110 md:flex-row md:gap-2 group",
                  isActive || (item.href === "/profile" && pathname.startsWith("/profile")) ? "text-gold" : "text-white/60"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all flex items-center justify-center",
                  isActive || (item.href === "/profile" && pathname.startsWith("/profile")) ? "bg-gold/10" : "group-hover:bg-white/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 md:h-4 md:w-4",
                    isActive || (item.href === "/profile" && pathname.startsWith("/profile")) ? "stroke-gold" : "stroke-white/60"
                  )} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] md:text-[11px] font-bold tracking-widest uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-full border border-gold/30 bg-black/40 px-5 py-2.5 text-xs font-bold tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
              >
                VVIP STATUS
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-[10px] font-bold tracking-widest text-white/20 hover:text-white transition-colors"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-[10px] font-bold tracking-widest text-gold hover:text-white transition-colors"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
