import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, productName, productDescription } = await request.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // 가맹점 결제 고유 ID 생성 (merchantUid)
    const merchantUid = `goldrush_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Payment 레코드 생성
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency: 'KRW',
        paymentMethod: 'card', // 기본값, 실제로는 사용자가 선택
        status: 'PENDING',
        merchantUid,
      },
    });

    return NextResponse.json(
      {
        success: true,
        merchantUid: payment.merchantUid,
        amount: payment.amount,
        currency: payment.currency,
        productName: productName || 'GoldRush Premium',
        productDescription: productDescription || 'Premium membership for GoldRush',
        userId: payment.userId,
        paymentId: payment.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment request error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request' },
      { status: 500 }
    );
  }
}
