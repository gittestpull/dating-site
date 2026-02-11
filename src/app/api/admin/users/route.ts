import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 전체 회원 목록
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        prestige: true,
        isApproved: true,
        location: true,
        occupation: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
