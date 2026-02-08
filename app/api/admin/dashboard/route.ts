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
    const pendingUsersCount = await prisma.user.count({
      where: { isApproved: false },
    });

    const totalUsersCount = await prisma.user.count();
    
    // Mocking inquiry counts for now since we don't have many inquiries yet
    const inquiryCount = await prisma.inquiry.count();

    const recentPendingUsers = await prisma.user.findMany({
      where: { isApproved: false },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        prestige: true
      }
    });

    return NextResponse.json({
      stats: {
        pendingUsers: pendingUsersCount,
        totalUsers: totalUsersCount,
        inquiries: inquiryCount,
      },
      recentPendingUsers
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
