import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { partnerId, scheduledAt, location } = await req.json();

  const booking = await prisma.booking.create({
    data: {
      requesterId: session.user.id as string,
      partnerId,
      scheduledAt: new Date(scheduledAt),
      location,
      status: "PENDING"
    }
  });

  return NextResponse.json(booking);
}
