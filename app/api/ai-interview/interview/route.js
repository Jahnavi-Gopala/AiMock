import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId} = await auth();
    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    return NextResponse.json({ success: true, data: user }, { status: 200 });
}

export async function POST(request) {
    const { type, role, techstack, amount, level } = await request.json();
    console.log("Body", { type, role, techstack, amount, level });
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try{
        if(!type || !role || !techstack || amount  === undefined || amount === null ||isNaN(Number(amount)) || !level){
            return NextResponse.json(
                { error: "All fields required" },
                { status: 400 }
            )
        }

        let text = "";
        let questions = [];

        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });
            const result= await model.generateContent(
                ` Prepare questions for a job interview.
            The jobrole is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
            Thank you! <3`
            )
            text = result.response.text();
            const clean = text.match(/\[[\s\S]*\]/)?.[0];
            if (clean) questions = JSON.parse(clean);
            } catch (error) {
            questions = text ? [text] : ["Failed to generate questions"];
            }
            console.log("QUESTIONS 👉", questions);
            const interview = await db.interview.create({
                data: {
                    type,
                    role,
                    techstack,
                    amount,
                    level,
                    questions: JSON.stringify(questions),
                    user: {
                        connect: { clerkUserId: userId }   // must match your User unique field
                        }
                }
            });
            return NextResponse.json(
        { success: true, interview },
        { status: 201 });
    }catch (error) {
    console.error("REAL ERROR 👉", error);
    console.error("STACK 👉", error?.stack);

  return NextResponse.json(
    { error: error.message || "Error processing request" },
    { status: 500 }
  );
}  
} 