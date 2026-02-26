"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { error } from "console";
import { generateAIInsights } from "../actions/dasboard";

export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) {
        throw error("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) throw Error("User not found");

    try {
        const result = await db.$transaction(
            async (tx) => {
                // find if the industry exists
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry
                    }
                })
                // if not create it with the default values will replace it with ai later
                if (!industryInsight) {
                    const insights = await generateAIInsights(data.industry);
                    industryInsight = await db.industryInsight.create({
                        data: {
                            industry: data.industry,
                            ...insights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    });
                    console.log("industry created", industryInsight);
                }
                // update user later
                const updatedUser = await tx.user.update({
                    where: {
                        clerkUserId: userId
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    }
                })
                return { updatedUser, industryInsight };
            }, {
            timeout: 100000,
        })
        return { success: true, ...result };
    } catch (error) {
        console.log(error);
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) {
        throw error("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) throw Error("User not found");

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                industry: true,
            }
        });
        return {
            isOnboarded: !!user?.industry
        }
    } catch (error) {
        console.error("Error checking onboarding status", error.message)
        throw new error("Error checking onboarding status");
    }
}

