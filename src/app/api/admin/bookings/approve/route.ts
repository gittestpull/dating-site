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
    const { bookingId } = await req.json();
    
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to approve booking" }, { status: 500 });
  }
}
