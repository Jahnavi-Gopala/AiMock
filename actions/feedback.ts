"use server";

import { db } from "@/lib/prisma";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "../app/lib/schema";
// import { redirect } from "next/navigation";


export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId : clerkId, transcript } = params;

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: clerkId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const formattedTranscript = transcript
      ?.map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("\n") || "";
// @ts-ignore
    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: feedbackSchema,
      prompt: `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
      - **Communication Skills**: Clarity, articulation, structured responses.
      - **Technical Knowledge**: Understanding of key concepts for the role.
      - **Problem-Solving**: Ability to analyze problems and propose solutions.
      - **Cultural & Role Fit**: Alignment with company values and job role.
      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
      "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = await db.feedback.create({
      data: {
        interviewId,
        userId: user.id,
        totalScore,
        categoryScores,
        strengths: strengths ,
        areasForImprovement: areasForImprovement ,
        finalAssessment,
      },
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error("Error generating feedback:", error);

    return {
      success: false,
      error: "Error generating feedback",
    };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId: clerkId } = params;

  const feedback = await db.feedback.findFirst({
    where: {
      interviewId: interviewId,
      user: {
        clerkUserId: clerkId, // Query through the relation!
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Cast as any or specific type to resolve the red squiggly
  return feedback as any; 
}

export async function getFeedbacksByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId: clerkId } = params;

  const feedback = await db.feedback.findFirst({
    where: {
      interviewId: interviewId,
      user: {
        clerkUserId: clerkId, // Query through the relation!
      },
    },
    select: {
      id: true,
      categoryScores: true,
      strengths: true,
      areasForImprovement: true,
      totalScore: true,
      finalAssessment: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Cast as any or specific type to resolve the red squiggly
  return feedback as any; 
}