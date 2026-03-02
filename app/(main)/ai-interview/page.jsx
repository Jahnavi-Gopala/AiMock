import Home from './components/Home';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "./InterviewCard";
import { getCurrentUser, getInterviewByUserId } from "@/actions/ai-interview";

const AiInterview = async () => {
  const user = await getCurrentUser();
  const userInterviews = await getInterviewByUserId(user?.id);
  const hasPastInterviews = userInterviews.length > 0;
  return (
    <div>
      <section className="flex flex-row  items-center justify-between rounded-[30px] bg-secondary p-8 max-sm:flex-col max-sm:gap-8">
        <div className="flex flex-col gap-6 text-4xl font-light max-w-3xl">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-xl">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/ai-interview/new-interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />

      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-3xl ">{user?.fullName? `${user.fullName}'s`: "Your"} Past Interviews
</h2>
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              interview?.id ? (
                <InterviewCard
                key={String(interview.id)}
                userId={user.id}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                />
                ) : null)
                )) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
      </section>
    </div>
  )
}

export default AiInterview