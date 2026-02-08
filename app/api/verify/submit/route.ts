import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, documentUrl } = await req.json();

  const verification = await prisma.verification.create({
    data: {
      userId: session.user.id as string,
      type,
      document: documentUrl,
      status: "PENDING"
    }
  });

  return NextResponse.json(verification);
}
