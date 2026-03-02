"use client"
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "./InterviewCard";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { dummyInterviews } from "../new/constants";


// // import { getCurrentUser } from "@/lib/actions/auth.actions";
// import {
//   getInterviewsByUserId,
//   getLatestInterviews,
// } from "@/lib/actions/general.action";

 function Home() {
  const { user, isLoaded } = useUser();

  const [userInterviews, setUserInterviews] = useState([]);
  const [allInterview, setAllInterview] = useState([]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchData = async () => {
      try {
        const [pastRes, upcomingRes] = await Promise.all([
          fetch(`/api/interviews/past?userId=${user.id}`),
          fetch(`/api/interviews/latest?userId=${user.id}`),
        ]);

        const pastData = await pastRes.json();
        const upcomingData = await upcomingRes.json();

        setUserInterviews(pastData || []);
        setAllInterview(upcomingData || []);
      } catch (err) {
        console.error("Error fetching interviews", err);
      }
    };

    fetchData();
  }, [isLoaded, user?.id]);

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview.length > 0;

  if (!isLoaded) return <Suspense 
                fallback={<BarLoader className="mt-4 " width={"100%"} color="gray"/>}>
                </Suspense>;

  return (
    <>
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
          {/* {hasPastInterviews ? (
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
                )) : ( */}
            {/* <p>You haven&apos;t taken any interviews yet</p> */}
          {/* )} */}

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {dummyInterviews.length > 0 ? (
              dummyInterviews.map((interview) => (
                <div
                  key={`dummy-past-${interview.id}`}
                  className="
                    flex-shrink-0
                    w-full
                    sm:w-1/2
                    lg:w-1/4
                  "
                >
                <InterviewCard
                  key={`dummy-past-${interview.id}`}   // ✅ unique key
                  userId={interview.userId}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
                </div>
              ))
            ) : (
              <p>You haven&apos;t taken any interviews yet </p> 
            )}
          </div>
            
      </section>

      {/* <section className="flex flex-col gap-6 mt-8 "> */}
        {/* <h2 className="text-3xl">Take Interviews</h2>

        <div className="flex flex-row gap-4 overflow-x-auto py-2">
          {dummyInterviews.length > 0 ? (
              dummyInterviews.map((interview) => (
                <InterviewCard
                  key={`dummy-past-${interview.id}`}   // ✅ unique key
                  userId={interview.userId}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))
            ) : (
              <p>No dummy interviews</p>
            )}
          </div> */}
          {/* {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              interview?.id ? (
                <InterviewCard
                key={interview.id}
                userId={user?.id}
                id={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                />
                ) : null)
                )
                ) : (
                  <p>There are no interviews available</p>
                  )} */}
                  {/* <p>There are no interviews available</p> */}
      {/* </section> */}
      
    </>
  );
}

export default Home;