import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Next.js 15+ requirement
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const profile = {
    ...user,
    tags: user.tags ? user.tags.split(",") : [],
    isVerified: true,
    lastLogin: "방금 전",
  };

  return NextResponse.json(profile);
}
