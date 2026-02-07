import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serendipity Score Calculation (0-100)
 * - Location Similarity (30%)
 * - Education Match (20%)
 * - Interest Overlap (30%)
 * - Age Compatibility (20%)
 */
function calculateSerendipityScore(user1: any, user2: any): number {
  let score = 0;

  // 1. Location Similarity (30%)
  if (user1.location && user2.location) {
    const locationScore = user1.location === user2.location ? 30 : 15;
    score += locationScore;
  } else {
    score += 15; // 기본값
  }

  // 2. Education Match (20%)
  if (user1.education && user2.education) {
    const educationScore = user1.education === user2.education ? 20 : 10;
    score += educationScore;
  } else {
    score += 10; // 기본값
  }

  // 3. Interest Overlap (30%)
  if (user1.tags && user2.tags) {
    const tags1 = user1.tags.split(',').map((t: string) => t.trim());
    const tags2 = user2.tags.split(',').map((t: string) => t.trim());
    const overlap = tags1.filter((t: string) => tags2.includes(t)).length;
    const overlapPercentage = (overlap / Math.max(tags1.length, 1)) * 100;
    const interestScore = (overlapPercentage / 100) * 30;
    score += Math.min(interestScore, 30);
  } else {
    score += 15; // 기본값
  }

  // 4. Age Compatibility (20%)
  if (user1.age && user2.age) {
    const ageDiff = Math.abs(user1.age - user2.age);
    let ageScore = 0;
    if (ageDiff <= 3) ageScore = 20;
    else if (ageDiff <= 5) ageScore = 15;
    else if (ageDiff <= 10) ageScore = 10;
    else ageScore = 5;
    score += ageScore;
  } else {
    score += 10; // 기본값
  }

  // 5. Prestige Bonus (추가: Platinum/Gold 등급 매칭)
  if (
    (user1.prestige === 'PLATINUM' && user2.prestige === 'PLATINUM') ||
    (user1.prestige === 'GOLD' && user2.prestige === 'GOLD')
  ) {
    score += 10; // 최대 110 가능
  }

  return Math.min(score, 100);
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 1. 현재 사용자 정보 조회
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 2. 이미 매칭된 사용자 제외
    const matchedUserIds = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    const excludeIds = [
      userId,
      ...matchedUserIds.map((m) => m.user1Id),
      ...matchedUserIds.map((m) => m.user2Id),
    ];

    // 3. Approved 사용자 중 제외 대상이 아닌 사람들 조회
    const candidates = await prisma.user.findMany({
      where: {
        isApproved: true,
        id: {
          notIn: excludeIds,
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        education: true,
        location: true,
        occupation: true,
        tags: true,
        prestige: true,
        image: true,
        bio: true,
      },
    });

    // 4. Serendipity Score 계산 및 정렬
    const scoredCandidates = candidates
      .map((candidate) => ({
        ...candidate,
        serendipityScore: calculateSerendipityScore(currentUser, candidate),
      }))
      .sort((a, b) => b.serendipityScore - a.serendipityScore)
      .slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        count: scoredCandidates.length,
        candidates: scoredCandidates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Match candidates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match candidates' },
      { status: 500 }
    );
  }
}
