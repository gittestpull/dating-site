"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) return { error: "Email already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      prestige: "SILVER", // Default
    },
  });

  return { success: true };
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "이메일 또는 비밀번호가 틀렸습니다." };
        default:
          return { error: "로그인 중 오류가 발생했습니다." };
      }
    }
    // NEXT_REDIRECT error must be re-thrown
    throw error;
  }
}

export async function sendMessage(matchId: string, content: string, senderId: string, receiverId: string) {
  return await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
      matchId,
    },
  });
}

export async function getMessages(matchId: string) {
  return await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
  });
}

export async function leaveMatch(matchId: string) {
  return await prisma.match.delete({
    where: { id: matchId },
  });
}

export async function reportUser(userId: string, reason: string) {
  console.log(`Report submitted for user ${userId}: ${reason}`);
  // In a real app, this would create a 'Report' record. 
  // For beta, we just mark the user for review.
  return { success: true };
}
