import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, targetId } = await request.json();

    if (!userId || !targetId) {
      return NextResponse.json(
        { error: 'userId and targetId are required' },
        { status: 400 }
      );
    }

    if (userId === targetId) {
      return NextResponse.json(
        { error: 'Cannot like yourself' },
        { status: 400 }
      );
    }

    // 1. 이미 매칭되었는지 확인
    const existingMatch = await prisma.match.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: userId < targetId ? userId : targetId,
          user2Id: userId < targetId ? targetId : userId,
        },
      },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: 'Already matched', matchId: existingMatch.id },
        { status: 409 }
      );
    }

    // 2. 새 Match 레코드 생성
    const match = await prisma.match.create({
      data: {
        user1Id: userId < targetId ? userId : targetId,
        user2Id: userId < targetId ? targetId : userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Match created successfully',
        matchId: match.id,
        user1Id: match.user1Id,
        user2Id: match.user2Id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Match like error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
