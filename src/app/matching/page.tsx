'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import CandidateCard from '@/components/match/CandidateCard';
import { Heart, Flame, ArrowLeft } from 'lucide-react';

interface Candidate {
  id: string;
  name?: string;
  age?: number;
  education?: string;
  location?: string;
  occupation?: string;
  tags?: string;
  prestige?: string;
  image?: string;
  bio?: string;
  serendipityScore: number;
}

export default function MatchingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchCandidates();
  }, [session]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/match/candidates?userId=${session?.user?.id}&limit=20`
      );
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
        setCurrentIndex(0);
      } else {
        showToast('❌ 후보 조회 실패', 'warning');
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      showToast('❌ 오류가 발생했습니다', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (targetId: string) => {
    try {
      const res = await fetch('/api/match/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          targetId,
        }),
      });

      if (res.ok) {
        showToast(`💕 ${candidates[currentIndex]?.name}님에게 좋아요를 보냈습니다!`, 'success');
        setLikeCount(likeCount + 1);
        handleNextCandidate();
      } else if (res.status === 409) {
        showToast('이미 매칭된 사용자입니다', 'info');
        handleNextCandidate();
      } else {
        showToast('좋아요 전송 실패', 'warning');
      }
    } catch (error) {
      console.error('Error sending like:', error);
      showToast('오류가 발생했습니다', 'warning');
    }
  };

  const handlePass = async (targetId: string) => {
    showToast(`${candidates[currentIndex]?.name}님을 패스했습니다`, 'info');
    handleNextCandidate();
  };

  const handleNextCandidate = () => {
    if (currentIndex < candidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      showToast('🎉 모든 후보를 확인했습니다!', 'success');
      setCurrentIndex(0);
      fetchCandidates();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Flame className="h-12 w-12 text-gold animate-pulse" />
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gold text-xl mb-4">사용 가능한 후보가 없습니다</p>
          <button
            onClick={() => router.push('/profile')}
            className="px-8 py-3 bg-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            프로필 완성하기
          </button>
        </div>
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gold/10 rounded-full transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-8 w-8 text-gold" />
            Matching
          </h1>
          <div className="text-center">
            <p className="text-xs text-gray-400">Today's Likes</p>
            <p className="text-xl font-bold text-gold">{likeCount}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <p className="text-sm text-gray-400">
              {currentIndex + 1} / {candidates.length}
            </p>
            <p className="text-sm text-gray-400">
              {Math.round(((currentIndex + 1) / candidates.length) * 100)}%
            </p>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / candidates.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Candidate Card */}
        <CandidateCard
          candidate={currentCandidate}
          onLike={handleLike}
          onPass={handlePass}
          isLoading={loading}
        />

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gold/10">
            <Heart className="h-6 w-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-gray-400">Total Likes</p>
            <p className="text-xl font-bold">{likeCount}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gold/10">
            <Flame className="h-6 w-6 text-gold mx-auto mb-2" />
            <p className="text-xs text-gray-400">AVG Score</p>
            <p className="text-xl font-bold">
              {candidates.length > 0
                ? Math.round(
                    candidates.reduce((sum, c) => sum + c.serendipityScore, 0) /
                      candidates.length
                  )
                : 0}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center border border-gold/10">
            <p className="text-xs text-gray-400">Remaining</p>
            <p className="text-xl font-bold">
              {Math.max(0, candidates.length - currentIndex - 1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
