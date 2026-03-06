"use server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { id } from "zod/v4/locales";

export async function getCurrentUser() {
  try {
    const user = await currentUser();

    if (!user) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      firstname: user.firstName,
      clerkId: user.clerkId,
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching Clerk user:", error);
    return null;
  }
}

export async function getInterviewByUserId(clerkUserId) {
  try {
    const interviews = await db.interview.findMany({
      where: {
        user: {
          clerkUserId: clerkUserId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    console.log("Interviews fetched from DB:", interviews);
    return interviews;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

