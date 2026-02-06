import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetId } = await req.json();
  if (!targetId) {
    return NextResponse.json({ error: "Target ID required" }, { status: 400 });
  }

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_targetId: {
          userId: session.user.id,
          targetId: targetId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ status: "removed" });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          targetId: targetId,
        },
      });
      return NextResponse.json({ status: "added" });
    }
  } catch (error) {
    console.error("Favorite error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { targetId: true },
    });
    return NextResponse.json(favorites.map(f => f.targetId));
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
