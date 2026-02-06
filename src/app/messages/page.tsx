"use client";

import { MessageCircle, Search, Crown, Star, Sparkles, Phone, MoreVertical, Send, ArrowLeft, Trash2, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage, leaveMatch, reportUser } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";
import Modal from "@/components/ui/Modal";

export default function MessagesPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/matches")
        .then((res) => res.json())
        .then((data) => {
          setMatches(data);
          if (data.length > 0) {
            // Default select first match but don't force show on mobile yet
            setSelectedMatch(data[0]);
          }
        });
    }
  }, [session]);

  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
    setShowChatOnMobile(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    showToast(
      isFavorited ? "💔 즐겨찾기에서 해제되었습니다" : "💖 즐겨찾기에 추가되었습니다!",
      isFavorited ? "info" : "favorite"
    );
  };

  const handleCall = () => {
    const otherUser = selectedMatch.user1Id === session?.user?.id ? selectedMatch.user2 : selectedMatch.user1;
    showToast(`📞 ${otherUser.name}님에게 보이스톡을 연결합니다... (VVIP 전용)`, "vip");
  };

  const filteredMatches = matches.filter(match => {
    const otherUser = match.user1Id === session?.user?.id ? match.user2 : match.user1;
    return otherUser.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    if (selectedMatch) {
      const fetchMsgs = async () => {
        const msgs = await getMessages(selectedMatch.id);
        setMessages(msgs);
      };
      fetchMsgs();
      const interval = setInterval(fetchMsgs, 3000); // Poll every 3s
      return () => clearInterval(interval);
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch || !session?.user?.id) return;

    const receiverId = selectedMatch.user1Id === session.user.id ? selectedMatch.user2Id : selectedMatch.user1Id;
    const msg = await sendMessage(selectedMatch.id, newMessage, session.user.id, receiverId);
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleLeaveChat = async () => {
    if (!selectedMatch) return;
    await leaveMatch(selectedMatch.id);
    setMatches(matches.filter(m => m.id !== selectedMatch.id));
    setSelectedMatch(null);
    setIsLeaveConfirmOpen(false);
    setIsOptionsOpen(false);
    showToast("🚪 대화방에서 퇴장했습니다.", "info");
  };

  const handleReport = async () => {
    const otherUser = selectedMatch.user1Id === session?.user?.id ? selectedMatch.user2 : selectedMatch.user1;
    await reportUser(otherUser.id, "신고 접수");
    setIsReportOpen(false);
    setIsOptionsOpen(false);
    showToast("🛡️ 신고가 접수되었습니다. VVIP 운영팀에서 검토합니다.", "warning");
  };

  if (!session) return <div className="p-20 text-center">로그인이 필요합니다.</div>;

  return (
    <div className="mx-auto flex h-[calc(100vh-80px)] max-w-7xl flex-col bg-background md:flex-row overflow-hidden border-x border-white/5">
      {/* Sidebar - Chat List */}
      <div className={`w-full border-white/5 md:w-[400px] md:border-r flex flex-col bg-surface/30 ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">메시지</h1>
            <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="대화 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl bg-white/5 py-4 pl-12 pr-4 text-xs font-bold tracking-widest uppercase outline-none focus:bg-white/10 focus:border-gold/30 border border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1 pb-8">
          <h2 className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">최근 대화</h2>
          {filteredMatches.map((match) => {
            const otherUser = match.user1Id === session.user?.id ? match.user2 : match.user1;
            return (
              <motion.div
                whileHover={{ x: 5 }}
                key={match.id}
                onClick={() => handleSelectMatch(match)}
                className={`group flex cursor-pointer items-center gap-5 rounded-[2rem] p-5 transition-all ${
                  selectedMatch?.id === match.id ? 'bg-gold/[0.03] border border-gold/10' : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="relative h-16 w-16 shrink-0 p-0.5 rounded-full border border-white/10">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image src={otherUser.image || "/profiles/ImageStudio_00001_.png"} alt={otherUser.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{otherUser.name}</span>
                      <Crown className="h-3 w-3 text-gold" />
                    </div>
                  </div>
                  <p className={`truncate text-xs ${selectedMatch?.id === match.id ? 'text-white font-medium' : 'text-white/30'}`}>
                    대화를 시작해보세요
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${showChatOnMobile ? 'flex' : 'hidden'} flex-1 flex-col bg-[#080808] md:flex`}>
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <div className="h-24 border-b border-white/5 px-4 md:px-10 flex items-center justify-between bg-surface/20">
              <div className="flex items-center gap-3 md:gap-5">
                <button 
                  onClick={() => setShowChatOnMobile(false)}
                  className="md:hidden h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>

                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-gold/30 p-0.5">
                   <div className="h-full w-full rounded-full overflow-hidden relative">
                      <Image 
                        src={(selectedMatch.user1Id === session.user?.id ? selectedMatch.user2.image : selectedMatch.user1.image) || "/profiles/ImageStudio_00001_.png"} 
                        alt="Profile" fill className="object-cover" 
                      />
                   </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg md:text-xl font-bold">{selectedMatch.user1Id === session.user?.id ? selectedMatch.user2.name : selectedMatch.user1.name}</h3>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  </div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gold uppercase tracking-[0.2em]">PREMIUM MEMBER</p>
                </div>
              </div>
              <div className="flex gap-2 md:gap-6">
                <button 
                  onClick={handleCall}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold transition-all"
                  title="전화 걸기"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button 
                  onClick={handleToggleFavorite}
                  className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl border flex items-center justify-center transition-all ${isFavorited ? 'bg-gold/10 border-gold text-gold' : 'bg-white/5 border-white/10 text-white/40 hover:text-gold'}`}
                  title="즐겨찾기"
                >
                  <Star className={`h-4 w-4 md:h-5 md:w-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={() => setIsOptionsOpen(true)}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold transition-all"
                  title="더보기"
                >
                  <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === session.user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3 md:px-6 md:py-4 ${
                    msg.senderId === session.user?.id 
                      ? 'bg-gold text-black font-medium rounded-tr-none shadow-[0_10px_30px_rgba(212,175,55,0.2)]' 
                      : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[9px] mt-2 ${msg.senderId === session.user?.id ? 'text-black/40' : 'text-white/20'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 md:p-8 bg-surface/10 border-t border-white/5">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold/50 transition-all"
                />
                <button 
                  type="submit"
                  className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gold-gradient flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Send className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 relative"
            >
              <div className="absolute inset-0 bg-gold/10 blur-[60px] rounded-full" />
              <div className="relative h-32 w-32 rounded-[2.5rem] bg-surface border border-white/10 flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-gold opacity-40" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">대화를 시작해보세요</h2>
            <p className="max-w-md text-white/30 text-lg leading-relaxed">
              상위 1%를 위한 GOLDRUSH 프라이빗 메시지 서비스입니다. <br />
              매너 있는 대화를 통해 소중한 인연을 만들어보세요.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        title="대화 옵션"
      >
        <div className="space-y-4">
          <button 
            onClick={() => setIsReportOpen(true)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-red-400 transition-all"
          >
            <ShieldAlert className="h-5 w-5" />
            <span className="font-bold text-sm">상대방 신고하기</span>
          </button>
          <button 
            onClick={() => setIsLeaveConfirmOpen(true)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
          >
            <Trash2 className="h-5 w-5 text-white/40" />
            <span className="font-bold text-sm">대화방 나가기</span>
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isLeaveConfirmOpen}
        onClose={() => setIsLeaveConfirmOpen(false)}
        title="대화방 나가기"
      >
        <div className="text-center py-4">
          <p className="text-lg mb-6">정말 이 대화방을 나가시겠습니까?<br/><span className="text-sm text-white/30">대화 내역이 모두 삭제되며 복구할 수 없습니다.</span></p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsLeaveConfirmOpen(false)}
              className="flex-1 py-4 rounded-xl bg-white/5 font-bold"
            >
              취소
            </button>
            <button 
              onClick={handleLeaveChat}
              className="flex-1 py-4 rounded-xl bg-red-500 text-white font-bold"
            >
              나가기
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title="회원 신고하기"
      >
        <div className="space-y-6">
          <p className="text-sm text-white/40">신고 사유를 선택해 주세요. VVIP 클럽의 품격을 유지하기 위해 허위 신고 시 불이익이 있을 수 있습니다.</p>
          <div className="grid grid-cols-1 gap-2">
            {["부적절한 메시지", "불쾌한 매너", "프로필 정보 허위", "홍보/스팸"].map(reason => (
              <button 
                key={reason}
                onClick={handleReport}
                className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
