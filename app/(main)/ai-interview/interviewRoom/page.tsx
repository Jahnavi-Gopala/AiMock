import Agent from "../components/Agent";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "../../../../actions/ai-interview";

const InterviewRoom = async () => {

  const user = await getCurrentUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const interview = await db.interview.findFirst({
    where: {
      userId: user.clerkId,
    },
    orderBy: { 
      createdAt: "desc",
    },
  });

  if (!interview) {
    return <div>No Interview Found</div>;
  }

  return (
    <>
      <h3 className="text-2xl font-bold ml-12">
        Interview Generation
      </h3>

      <Agent
        userName={user.username || "User"}
        userId={user.id}
        type={interview.type}
        role={interview.role}
        level={interview.level}
        techstack={interview.techstack}
        amount={interview.amount}
/>
    </>
  );
};

export default InterviewRoom;