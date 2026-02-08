import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.prestige !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { inquiryId } = await req.json();
    
    // For now, we just mark it as ANSWERED.
    // In a real app, we would send an email or message back to the user.
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status: "ANSWERED" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reply" }, { status: 500 });
  }
}
