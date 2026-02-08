import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function calculateMatchScore(user: any) {
  let score = 0;
  const assets = user.assets || 0;
  score += Math.min((assets / 1000000000) * 50, 50);

  const occ = (user.occupation || "").toLowerCase();
  const highTier = ["원장", "변호사", "ceo", "창업자", "기장", "전문의", "매니저", "디렉터", "캐피탈"];
  const midTier = ["모델", "인플루언서", "골퍼", "대표", "큐레이터", "건축가", "에디터", "전문직"];

  if (highTier.some(t => occ.includes(t))) score += 30;
  else if (midTier.some(t => occ.includes(t))) score += 20;
  else score += 10;

  const prestige = user.prestige || "SILVER";
  switch(prestige) {
    case "DIAMOND": case "VVIP": score += 20; break;
    case "PLATINUM": case "GOLD": score += 15; break;
    case "SILVER": score += 10; break;
    default: score += 5;
  }
  return Math.round(score);
}

export async function GET() {
  try {
    // Fetch ALL approved users (Real and Beta are now both in DB)
    const dbUsers = await prisma.user.findMany({
      where: { isApproved: true, NOT: { email: "darkkwang79@gmail.com" } },
      orderBy: { createdAt: "desc" }
    });

    const allProfiles = dbUsers.map(user => ({
      ...user,
      tags: user.tags ? user.tags.split(",") : ["럭셔리", "자기관리"],
      isVerified: true,
      lastLogin: user.email?.startsWith('beta') ? 'Online' : '방금 전',
      matchScore: calculateMatchScore(user)
    }));

    allProfiles.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(allProfiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Failed to load profiles" }, { status: 500 });
  }
}
