import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PortOnePaymentResponse {
  code: number;
  message: string;
  response?: {
    imp_uid: string;
    merchant_uid: string;
    pay_method: string;
    status: string;
    amount: number;
    currency: string;
    receipt_url?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { impUid, merchantUid } = await request.json();

    if (!impUid || !merchantUid) {
      return NextResponse.json(
        { error: 'Missing impUid or merchantUid' },
        { status: 400 }
      );
    }

    // 1. Payment 레코드 조회
    const payment = await prisma.payment.findUnique({
      where: { merchantUid },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // 2. PortOne API로 결제 정보 조회 (실제 환경에서는 Server-side validation 필수)
    // 테스트 모드에서는 mock response 사용
    const isTestMode = impUid.startsWith('test_');

    let paymentStatus = 'COMPLETED';
    let receiptUrl: string | null = null;
    let errorMessage: string | null = null;

    if (!isTestMode) {
      // 실제 PortOne API 호출 (액세스 토큰 필요)
      // const accessToken = await getPortOneAccessToken();
      // const response = await fetch(`https://api.iamport.kr/payments/${impUid}`, {
      //   headers: { Authorization: accessToken }
      // });
      // const data = await response.json() as PortOnePaymentResponse;

      // 임시: 테스트 데이터
      paymentStatus = 'COMPLETED';
      receiptUrl = `https://example.com/receipt/${impUid}`;
    }

    // 3. Payment 레코드 업데이트
    const updatedPayment = await prisma.payment.update({
      where: { merchantUid },
      data: {
        impUid,
        status: paymentStatus === 'paid' ? 'COMPLETED' : paymentStatus,
        receiptUrl,
        errorMessage,
      },
    });

    // 4. 결제 성공 시 Revenue 레코드 생성
    if (updatedPayment.status === 'COMPLETED') {
      const revenue = await prisma.revenue.create({
        data: {
          userId: payment.userId,
          type: 'PREMIUM', // 또는 동적으로 결정
          amount: payment.amount,
          currency: payment.currency,
          status: 'COMPLETED',
          description: `Payment via ${updatedPayment.paymentMethod}`,
          orderId: updatedPayment.merchantUid,
          paymentId: updatedPayment.id,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Payment confirmed and revenue recorded',
          payment: updatedPayment,
          revenue,
        },
        { status: 200 }
      );
    }

    // 결제 실패
    return NextResponse.json(
      {
        success: false,
        message: 'Payment failed',
        error: errorMessage || 'Unknown error',
      },
      { status: 402 }
    );
  } catch (error) {
    console.error('Payment confirm error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
