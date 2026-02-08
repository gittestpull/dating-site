import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.prestige !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Manually fetch user details because Inquiry doesn't have a relation defined in prisma schema yet for easy include
    const userIds = [...new Set(inquiries.map(i => i.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    });

    const enrichedInquiries = inquiries.map(inquiry => ({
      ...inquiry,
      user: users.find(u => u.id === inquiry.userId)
    }));

    return NextResponse.json(enrichedInquiries);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
