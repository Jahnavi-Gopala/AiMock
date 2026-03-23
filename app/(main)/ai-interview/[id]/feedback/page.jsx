import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  getFeedbackByInterviewId,
} from "../../../../../actions/feedback";
import { getInterviewByUserId } from "../../../../../actions/ai-interview";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

const FeedbackPage = async ({ params }) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in"); 

  const interviews = await getInterviewByUserId(userId);

  const interview = interviews.find((item) => item.id === id);

  if (!interviews) redirect("/ai-interview");

  const { role, techstack, type} = interview;


  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: userId,
  });



  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Generating your feedback...</h2>
        <p className="text-gray-500">This usually takes about 10-15 seconds.</p>
      </div>
    );
  }

  return (
    <section className="p-10 flex flex-col gap-10 max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-5xl font-bold gradient-title-animate ">
          Feedback On The Interview : {" "} 
          <span className="capitalize text-primary-200 gradient-title-animate">
             {role}
          </span>
        </h1>
        


        <div className="flex flex-row gap-8 mt-4">
          {/* TechStack*/}
          <div className="flex items-center gap-2">
            <Image src="/tech.svg" width={24} height={24} alt="tech" />
            <p className="text-lg">
              Tech Stack:{" "}
              <span className=" capitalize text-primary-200 font-bold">
                {techstack} 
              </span>
            </p> 
          </div>

          {/* Interview Type */}
          <div className="flex items-center gap-2">
            <Image src="/profile.svg" width={24} height={24} alt="tech" className="rounded-full" />
            <p className="text-lg">
              Interview Type:{" "}
              <span className=" capitalize text-primary-200 font-bold">
                {type} 
              </span>
            </p> 
          </div>
        </div>

        <div className="flex flex-row gap-8 mt-4">
          {/* Overall Score */}
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={24} height={24} alt="star" />
            <p className="text-lg">
              Overall Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={24} height={24} alt="calendar" />
            <p className="text-lg text-primary-200 font-bold">
              {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-primary-50 border border-primary-200 rounded-xl bg-gray-900">
        <h2 className="text-xl font-bold mb-2">Final Assessment</h2>
        <p className="text-primary leading-relaxed">{feedback.finalAssessment}</p>
      </div>

      {/* Interview Breakdown - Object mapping logic */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Performance Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {Object.entries(feedback.categoryScores).map(([categoryName, data], index) => (
            <div key={categoryName} className="p-5 border rounded-xl shadow-sm ">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{categoryName}</span>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                  {data.score}/100
                </span>
              </div>
              <p className="text-sm text-gray-300 italic">"{data.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="flex flex-col gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
          <h3 className="text-xl font-bold text-green-800">Strengths</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-green-900 italic">
            {feedback.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="flex flex-col gap-4 p-6 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="text-xl font-bold text-orange-800">Areas for Improvement</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-orange-900 italic">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row gap-4 mt-6">
        <Button asChild className="flex-1 py-6 bg-white border-2 border-primary-200 hover:bg-gray-50">
          <Link href="/ai-interview" className="text-primary-200 font-bold">
            Back to Dashboard
          </Link>
        </Button>

        <Button asChild className="flex-1 py-6 bg-white border-2 border-primary-200 hover:bg-gray-50">
          <Link href={'/ai-interview/interviewRoom'} className="text-secondary font-bold">
            Retake Interview
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;