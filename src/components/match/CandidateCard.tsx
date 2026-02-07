'use client';

import { useState } from 'react';
import { Heart, X } from 'lucide-react';

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

interface CandidateCardProps {
  candidate: Candidate;
  onLike: (targetId: string) => void;
  onPass: (targetId: string) => void;
  isLoading?: boolean;
}

export default function CandidateCard({
  candidate,
  onLike,
  onPass,
  isLoading = false,
}: CandidateCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isPassing, setIsPassing] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike(candidate.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handlePass = async () => {
    setIsPassing(true);
    try {
      await onPass(candidate.id);
    } finally {
      setIsPassing(false);
    }
  };

  const scoreColor = 
    candidate.serendipityScore >= 80 ? 'text-green-400' :
    candidate.serendipityScore >= 60 ? 'text-yellow-400' :
    'text-orange-400';

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-black rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
      {/* Image Section */}
      <div className="relative h-96 bg-gray-800 flex items-center justify-center">
        {candidate.image ? (
          <img
            src={candidate.image}
            alt={candidate.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gold/20 to-gray-900">
            <div className="text-center">
              <div className="text-6xl font-bold text-gold/30 mb-2">
                {candidate.name?.[0]}
              </div>
              <p className="text-gray-500">No image</p>
            </div>
          </div>
        )}

        {/* Prestige Badge */}
        {candidate.prestige && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold/20 border border-gold/40">
            <p className="text-xs font-bold text-gold">{candidate.prestige}</p>
          </div>
        )}

        {/* Serendipity Score */}
        <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/60 border border-gold/40">
          <p className={`text-sm font-bold ${scoreColor}`}>
            ✨ {candidate.serendipityScore}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4">
        {/* Name & Age & Location */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {candidate.name}, {candidate.age}
          </h2>
          {candidate.location && (
            <p className="text-sm text-gold">📍 {candidate.location}</p>
          )}
        </div>

        {/* Education & Occupation */}
        {(candidate.education || candidate.occupation) && (
          <div className="text-sm text-gray-300">
            {candidate.education && <p>🎓 {candidate.education}</p>}
            {candidate.occupation && <p>💼 {candidate.occupation}</p>}
          </div>
        )}

        {/* Bio */}
        {candidate.bio && (
          <p className="text-sm text-gray-400 italic">"{candidate.bio}"</p>
        )}

        {/* Tags */}
        {candidate.tags && (
          <div className="flex flex-wrap gap-2">
            {candidate.tags
              .split(',')
              .map((tag: string) => (
                <span
                  key={tag.trim()}
                  className="px-2 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs text-gold"
                >
                  #{tag.trim()}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex gap-4 bg-black/40 border-t border-gold/10">
        <button
          onClick={handlePass}
          disabled={isLoading || isPassing || isLiking}
          className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all"
        >
          <X className="h-5 w-5" />
          Pass
        </button>
        <button
          onClick={handleLike}
          disabled={isLoading || isLiking || isPassing}
          className="flex-1 py-3 rounded-xl bg-gold hover:bg-yellow-500 disabled:opacity-50 text-black font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Heart className="h-5 w-5 fill-current" />
          Like
        </button>
      </div>
    </div>
  );
}
