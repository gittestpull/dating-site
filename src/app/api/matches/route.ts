import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUserId = session.user.id;

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

  // Ensure tags are split for the frontend
  const formattedMatches = matches.map(match => ({
    ...match,
    user1: { ...match.user1, tags: match.user1.tags ? match.user1.tags.split(",") : [] },
    user2: { ...match.user2, tags: match.user2.tags ? match.user2.tags.split(",") : [] },
  }));

  return NextResponse.json(formattedMatches);
}
