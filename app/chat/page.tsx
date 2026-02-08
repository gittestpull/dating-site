'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageCircle, ArrowLeft } from 'lucide-react';

interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  user1?: { name?: string; image?: string };
  user2?: { name?: string; image?: string };
  messages?: any[];
}

export default function ChatPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchMatches();
  }, [session]);

  const fetchMatches = async () => {
    try {
      // 사용자의 모든 매치 조회 (간단한 구현)
      // 실제로는 /api/matches 엔드포인트 필요
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">로그인이 필요합니다</p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gold/10 rounded-full transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <MessageCircle className="h-8 w-8 text-gold" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {/* Chat Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Matches List */}
          <div className="bg-gray-900 rounded-2xl border border-gold/20 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gold/20">
              <h2 className="font-bold">Matches</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {matches.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">매칭된 사용자가 없습니다</p>
                </div>
              ) : (
                matches.map((match) => {
                  const isUser1 = match.user1Id === session?.user?.id;
                  const partner = isUser1 ? match.user2 : match.user1;

                  return (
                    <button
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`w-full p-3 border-b border-gold/10 hover:bg-gold/10 transition text-left ${
                        selectedMatch?.id === match.id ? 'bg-gold/20' : ''
                      }`}
                    >
                      <p className="font-bold text-sm">{partner?.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {match.messages?.[0]?.content || 'No messages'}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2">
            {selectedMatch ? (
              <ChatWindow
                matchId={selectedMatch.id}
                userId={session?.user?.id}
                partnerName={
                  selectedMatch.user1Id === session?.user?.id
                    ? selectedMatch.user2?.name || 'User'
                    : selectedMatch.user1?.name || 'User'
                }
              />
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-gold/20 h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  매치를 선택하여 대화를 시작하세요 💬
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
