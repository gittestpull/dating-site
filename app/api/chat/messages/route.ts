import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get('matchId');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId is required' },
        { status: 400 }
      );
    }

    // 1. Match 확인
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    // 2. 메시지 조회 (최신순)
    const messages = await prisma.message.findMany({
      where: { matchId },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        status: true,
        senderId: true,
        sender: { select: { name: true, image: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(
      {
        success: true,
        matchId,
        messageCount: messages.length,
        messages: messages.reverse(), // 오래된 것부터 표시
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
