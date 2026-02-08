import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { matchId } = await req.json();
  const userId = session.user.id;

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) return NextResponse.json({ error: "Match not found" }, { status: 404 });

  let updateData = {};
  if (match.user1Id === userId) updateData = { deleteRequestUser1: true };
  if (match.user2Id === userId) updateData = { deleteRequestUser2: true };

  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: updateData
  });

  // If both parties agreed, wipe logs
  if (updatedMatch.deleteRequestUser1 && updatedMatch.deleteRequestUser2) {
    await prisma.message.deleteMany({
      where: { matchId }
    });
    // Reset requests
    await prisma.match.update({
      where: { id: matchId },
      data: { deleteRequestUser1: false, deleteRequestUser2: false }
    });
    return NextResponse.json({ status: "wiped" });
  }

  return NextResponse.json({ status: "requested" });
}
