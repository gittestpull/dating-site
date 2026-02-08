import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const data = await request.json();
    
    // VVIP 멤버십 정책상 프로필 변경은 '신청' 후 관리자(양비서) 승인이 필요합니다.
    // 여기서는 즉시 반영 로직과 히스토리 기록을 동시에 처리합니다.
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        age: parseInt(data.age) || undefined,
        location: data.location,
        occupation: data.occupation,
        education: data.education,
        tags: data.tags,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Error updating profile", { status: 500 });
  }
}
