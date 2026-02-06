"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Star, Crown, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

// 생성된 고퀄리티 이미지들
const GALLERY_IMAGES = [
  { src: "/profiles/KR_Woman_20s_1_00001_.png", name: "소연", age: 24, occupation: "모델" },
  { src: "/profiles/KR_Woman_20s_2_00001_.png", name: "유나", age: 26, occupation: "디자이너" },
  { src: "/profiles/KR_Woman_20s_3_00001_.png", name: "혜진", age: 27, occupation: "변호사" },
  { src: "/profiles/KR_Woman_20s_4_00001_.png", name: "지원", age: 25, occupation: "아나운서" },
  { src: "/profiles/KR_Woman_20s_5_00001_.png", name: "민지", age: 28, occupation: "CEO" },
  { src: "/profiles/KR_Woman_30s_1_00001_.png", name: "서윤", age: 31, occupation: "의사" },
  { src: "/profiles/KR_Woman_30s_2_00001_.png", name: "다희", age: 32, occupation: "피아니스트" },
  { src: "/profiles/KR_Woman_30s_3_00001_.png", name: "나연", age: 30, occupation: "호텔리어" },
  { src: "/profiles/Luxury_Fashion_1_00001_.png", name: "수아", age: 27, occupation: "패션에디터" },
  { src: "/profiles/Luxury_Fashion_2_00001_.png", name: "예은", age: 29, occupation: "인플루언서" },
  { src: "/profiles/Luxury_Fashion_3_00001_.png", name: "채원", age: 26, occupation: "큐레이터" },
  { src: "/profiles/LuxurySwimwear_00001_.png", name: "지수", age: 28, occupation: "요가강사" },
];

export default function Home() {
  const { data: session } = useSession();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/profiles")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profiles");
        return res.json();
      })
      .then(data => setFeaturedProfiles(data.slice(0, 3)))
      .catch(err => setError(err.message));
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % GALLERY_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section - High-End Aesthetic */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Golden Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gold/20 bg-gold/5 px-6 py-2 text-xs font-bold tracking-[0.4em] text-gold backdrop-blur-xl uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Privé Membership Only</span>
            </div>
            
            <h1 className="mb-10 text-6xl font-bold tracking-tighter text-white md:text-9xl leading-[1.1]">
              {session?.user ? (
                <>WELCOME <br /><span className="text-gold-gradient italic font-serif uppercase">{session.user.name}</span></>
              ) : (
                <>WHERE <span className="text-gold-gradient italic font-serif">GOLD</span> <br /> MEETS <span className="text-white/40">GRACE</span></>
              )}
            </h1>
            
            <p className="mb-14 text-white/50 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              GOLDRUSH goes beyond matching, with top class <br className="hidden md:block" />
              private community sharing lifestyle and values.
            </p>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/matching"
                className="group relative flex items-center gap-4 rounded-full bg-gold-gradient px-12 py-5 text-sm font-bold tracking-widest text-black transition-all hover:scale-105 premium-shadow"
              >
                DISCOVER MATCHES
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/vvip-lounge"
                className="rounded-full border border-white/10 bg-white/5 px-12 py-5 text-sm font-bold tracking-widest text-white transition-all hover:bg-white/10 backdrop-blur-md uppercase"
              >
                Enter Lounge
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-16 w-full px-10 hidden lg:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-white/30 text-[10px] font-bold tracking-[0.4em] uppercase">
            <div className="flex items-center gap-4">
              <span className="text-gold">01</span> VERIFIED STATUS
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gold">02</span> ABSOLUTE PRIVACY
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gold">03</span> ELITE NETWORK
            </div>
          </div>
        </div>
      </section>

      {/* Featured Members Section */}
      <section className="mx-auto max-w-7xl px-4 w-full">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-gold">
              <Crown className="h-4 w-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Elite Selection</span>
            </div>
            <h2 className="text-5xl font-bold text-white tracking-tight">Today's Elite</h2>
          </div>
          <Link href="/matching" className="group flex items-center gap-3 text-white/40 font-bold tracking-widest text-xs hover:text-gold transition-colors">
            VIEW ALL MEMBERS
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold group-hover:bg-gold group-hover:text-black transition-all">
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      {/* ✨ Premium Gallery Slider - 생성된 이미지 쇼케이스 */}
      <section className="py-20 bg-gradient-to-b from-background via-surface to-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Premium Members</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Exclusive <span className="text-gold-gradient">Gallery</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              엄선된 VVIP 멤버들의 프로필을 만나보세요
            </p>
          </div>

          {/* Main Slider */}
          <div className="relative">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Prev Button */}
              <button 
                onClick={prevSlide}
                className="z-10 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-gold hover:border-gold hover:text-black transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Slides Container */}
              <div className="relative w-full max-w-4xl h-[500px] md:h-[600px] overflow-hidden rounded-[2rem]">
                {GALLERY_IMAGES.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      opacity: index === currentSlide ? 1 : 0,
                      scale: index === currentSlide ? 1 : 0.9,
                      zIndex: index === currentSlide ? 10 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={img.src}
                      alt={img.name}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Info Card */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-8 left-8 right-8"
                    >
                      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gold-gradient flex items-center justify-center">
                            <Crown className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{img.name}, {img.age}</h3>
                            <p className="text-gold text-sm font-medium">{img.occupation}</p>
                          </div>
                          <Link 
                            href="/matching" 
                            className="ml-auto px-6 py-3 bg-gold-gradient rounded-full text-black font-bold text-sm hover:scale-105 transition-transform"
                          >
                            프로필 보기
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Next Button */}
              <button 
                onClick={nextSlide}
                className="z-10 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-gold hover:border-gold hover:text-black transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {GALLERY_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? "w-8 bg-gold" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="mt-16 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {GALLERY_IMAGES.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.05 }}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  index === currentSlide ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt={img.name} fill className="object-cover" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-surface relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              The Standard of <br />
              <span className="text-gold-gradient">Noblesse Matching</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: "Strict Verification", desc: "7-step identity verification including assets, job, etc." },
                { title: "Privacy First", desc: "All matching is encrypted, no data shared without consent." },
                { title: "Concierge Support", desc: "Dedicated managers care for matching and date course suggestions." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="mt-1 h-6 w-6 rounded-full border border-gold flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5 premium-shadow">
             <Image 
                src="/profiles/LuxurySwimwear_00001_.png" 
                alt="Luxury Lifestyle" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
              />
              <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          className="bg-surface border-gold-glow rounded-[4rem] p-20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gold/50" />
          <Star className="h-10 w-10 text-gold mx-auto mb-10 opacity-50" />
          <h2 className="mb-8 text-5xl font-bold tracking-tight">Start your own special world <br /> right now.</h2>
          <p className="mb-14 text-white/40 text-lg max-w-xl mx-auto">
            GOLDRUSH membership applications are screened with strict standards. <br />
            Take the first step for a classy meeting.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-full bg-gold-gradient px-16 py-6 text-sm font-bold tracking-[0.3em] text-black transition-transform hover:scale-105 uppercase"
          >
            Apply for Membership
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
