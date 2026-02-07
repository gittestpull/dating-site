import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { matchId, senderId, content, imageUrl } = await request.json();

    if (!matchId || !senderId || !content) {
      return NextResponse.json(
        { error: 'matchId, senderId, and content are required' },
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

    // 2. 발신자가 Match에 속하는지 확인
    if (senderId !== match.user1Id && senderId !== match.user2Id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 3. 수신자 결정
    const receiverId = senderId === match.user1Id ? match.user2Id : match.user1Id;

    // 4. 메시지 생성
    const message = await prisma.message.create({
      data: {
        matchId,
        senderId,
        receiverId,
        content,
        imageUrl: imageUrl || null,
        status: 'SENT',
      },
      include: {
        sender: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: {
          id: message.id,
          content: message.content,
          imageUrl: message.imageUrl,
          status: message.status,
          sender: message.sender,
          createdAt: message.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Chat send error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
