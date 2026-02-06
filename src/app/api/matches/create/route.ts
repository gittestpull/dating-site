import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { targetUserId } = await request.json();

  const match = await prisma.match.upsert({
    where: {
      user1Id_user2Id: {
        user1Id: session.user.id,
        user2Id: targetUserId,
      },
    },
    update: {},
    create: {
      user1Id: session.user.id,
      user2Id: targetUserId,
    },
  });

  return NextResponse.json(match);
}
