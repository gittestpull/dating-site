import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const revenues = await prisma.revenue.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const summary = {
      total: revenues.reduce((sum, r) => sum + r.amount, 0),
      completed: revenues
        .filter((r) => r.status === "COMPLETED")
        .reduce((sum, r) => sum + r.amount, 0),
      pending: revenues
        .filter((r) => r.status === "PENDING")
        .reduce((sum, r) => sum + r.amount, 0),
      byType: {
        SUBSCRIPTION: revenues
          .filter((r) => r.type === "SUBSCRIPTION" && r.status === "COMPLETED")
          .reduce((sum, r) => sum + r.amount, 0),
        PREMIUM: revenues
          .filter((r) => r.type === "PREMIUM" && r.status === "COMPLETED")
          .reduce((sum, r) => sum + r.amount, 0),
        ADDON: revenues
          .filter((r) => r.type === "ADDON" && r.status === "COMPLETED")
          .reduce((sum, r) => sum + r.amount, 0),
      },
    };

    return NextResponse.json({ revenues, summary });
  } catch (error) {
    console.error("Failed to fetch revenue:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, description } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const revenue = await prisma.revenue.create({
      data: {
        userId: userId || null,
        type,
        amount,
        description,
        status: "COMPLETED",
      },
    });

    return NextResponse.json(revenue, { status: 201 });
  } catch (error) {
    console.error("Failed to create revenue:", error);
    return NextResponse.json(
      { error: "Failed to create revenue" },
      { status: 500 }
    );
  }
}
