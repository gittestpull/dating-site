import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUserId = session.user.id;

  // Find all users who are approved AND have a match with the current user
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: currentUserId },
        { user2Id: currentUserId },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const matchedUsers = matches.map(m => {
    return m.user1Id === currentUserId ? m.user2 : m.user1;
  });

  return NextResponse.json(matchedUsers);
}
