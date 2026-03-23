"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/dist/server/api-utils";

const genAI =new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model : "gemini-2.5-flash",
});


export const generateAIInsights = async (industry) => {
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
    const { userId} = await auth();
    if(!userId) {
        throw error("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
    return { redirect: "/onboarding" }; // ✅ return instead
    }
    if(!user.industryInsights){
        const insights = await generateAIInsights(user.industry);
        // const industryInsight = await db.industryInsight.upsert({
        //     data: {
        //         industry:user.industry,
        //         ...insights,
        //         nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        //     }
        // });
        // return industryInsight;
        const industryInsight = await db.industryInsight.upsert({
        where: {
            industry: user.industry, // must be UNIQUE
        },

        create: {
            industry: user.industry,
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },

        update: {
            salaryRanges: insights.salaryRanges,
            growthRate: insights.growthRate,
            demandLevel: insights.demandLevel,
            topSkills: insights.topSkills,
            marketOutlook: insights.marketOutlook,
            keyTrends: insights.keyTrends,
            recommendedSkills: insights.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        });
        return industryInsight;
    }
    return user.industryInsights;
}