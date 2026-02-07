"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MessageSquare, ShieldCheck, DollarSign, Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import Modal from "@/components/ui/Modal";
import RevenueModal from "@/components/admin/RevenueModal";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    pendingUsers: 0,
    totalUsers: 0,
    inquiries: 0
  });
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'inquiries' | 'bookings'>('pending');
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [revenueSummary, setRevenueSummary] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchInquiries();
    fetchBookings();
    fetchRevenue();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setPendingUsers(data.recentPendingUsers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch("/api/admin/revenue");
      if (res.ok) {
        const data = await res.json();
        setRevenueSummary(data.summary);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (userId: string) => {
    const res = await fetch("/api/admin/users/approve", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    
    if (res.ok) {
      showToast("✅ 회원 승인이 완료되었습니다.", "success");
      fetchDashboardData(); 
    } else {
      showToast("❌ 승인 실패", "warning");
    }
  };
  
  const handleBookingApprove = async (bookingId: string) => {
    const res = await fetch("/api/admin/bookings/approve", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
    
    if (res.ok) {
      showToast("✅ 예약이 확정되었습니다.", "success");
      fetchBookings();
    } else {
      showToast("❌ 예약 확정 실패", "warning");
    }
  };

  const handleInquiryReply = async (inquiryId: string) => {
    const res = await fetch("/api/admin/inquiries/reply", {
      method: "POST",
      body: JSON.stringify({ inquiryId }),
    });
    
    if (res.ok) {
      showToast("✅ 답변 완료 처리되었습니다.", "success");
      fetchInquiries();
    } else {
      showToast("❌ 처리 실패", "warning");
    }
  };

  // @ts-ignore
  if (session?.user?.prestige !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">접근 권한이 없습니다</h1>
          <p className="text-white/40 mb-8">관리자 계정으로 로그인해주세요.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">GoldRush Management</h1>
            <p className="text-white/40">VVIP Concierge Admin System</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full bg-white/5 border border-white/10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gold-gradient" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-400/10">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold">{stats.pendingUsers}</span>
            </div>
            <p className="text-sm text-white/60">가입 승인 대기</p>
          </div>
          
          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gold/10">
                <Calendar className="h-6 w-6 text-gold" />
              </div>
              <span className="text-2xl font-bold">{stats.inquiries}</span>
            </div>
            <p className="text-sm text-white/60">신규 문의/예약</p>
          </div>

          <div className="bg-surface border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-400/10">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold">{stats.totalUsers}</span>
            </div>
            <p className="text-sm text-white/60">총 회원 수</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-surface border border-white/10 rounded-[2rem] p-8">
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`text-sm font-bold pb-2 ${activeTab === 'pending' ? 'text-gold border-b-2 border-gold' : 'text-white/40'}`}
              >
                가입 대기 ({pendingUsers.length})
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-sm font-bold pb-2 ${activeTab === 'bookings' ? 'text-gold border-b-2 border-gold' : 'text-white/40'}`}
              >
                파티 예약 ({bookings.length})
              </button>
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`text-sm font-bold pb-2 ${activeTab === 'inquiries' ? 'text-gold border-b-2 border-gold' : 'text-white/40'}`}
              >
                문의/상담 ({inquiries.length})
              </button>
            </div>

            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingUsers.length === 0 ? (
                  <p className="text-white/40 text-center py-10">대기 중인 회원이 없습니다.</p>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/40">
                          {user.name?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{user.name}</h3>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{user.email}</span>
                          </div>
                          <p className="text-xs text-white/40">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApprove(user.id)}
                        className="px-4 py-2 rounded-xl bg-gold/20 text-gold text-xs font-bold hover:bg-gold hover:text-black transition-all"
                      >
                        승인하기
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-white/40 text-center py-10">접수된 예약이 없습니다.</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all">
                      <div>
                        <h3 className="font-bold">{booking.requester?.name}님의 예약</h3>
                        <p className="text-xs text-white/40">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gold">{booking.location || "장소 미정"}</p>
                      </div>
                      {booking.status === 'PENDING' ? (
                        <button 
                          onClick={() => handleBookingApprove(booking.id)}
                          className="px-4 py-2 rounded-xl bg-gold/20 text-gold text-xs font-bold hover:bg-gold hover:text-black transition-all"
                        >
                          예약 확정
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold">확정됨</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <p className="text-white/40 text-center py-10">접수된 문의가 없습니다.</p>
                ) : (
                  inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 transition-all">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white/40">
                        {inquiry.user?.name?.[0] || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold">{inquiry.user?.name || "Unknown"}</h3>
                          <span className="text-xs text-white/40">{new Date(inquiry.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-gold/10 text-[10px] font-bold text-gold border border-gold/20">
                            {inquiry.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inquiry.status === 'PENDING' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {inquiry.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/80 mb-3">{inquiry.content}</p>
                        
                        {inquiry.status === 'PENDING' && (
                          <button 
                            onClick={() => handleInquiryReply(inquiry.id)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                          >
                            답변 완료 처리
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-xl font-bold mb-6">빠른 관리</h2>
            <div className="space-y-4">
              <button 
                onClick={() => setActiveTab('bookings')}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all font-medium text-left px-6"
              >
                📝 파티 예약 관리
              </button>
              <button 
                onClick={() => setActiveTab('pending')}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all font-medium text-left px-6"
              >
                👥 회원 승인 관리
              </button>
              <button 
                onClick={() => setActiveTab('inquiries')}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all font-medium text-left px-6"
              >
                💬 1:1 상담 답변하기
              </button>
              <button 
                onClick={() => setIsRevenueModalOpen(true)}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all font-medium text-left px-6"
              >
                📊 매출 및 통계 확인
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <RevenueModal 
        isOpen={isRevenueModalOpen} 
        onClose={() => {
          setIsRevenueModalOpen(false);
          fetchRevenue();
        }} 
        data={revenueSummary}
      />
    </div>
  );
}
