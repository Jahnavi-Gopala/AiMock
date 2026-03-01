"use client"

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "../new/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({
  userName,
  userId,
  type,
}: {
  userName: string;
  userId: string;
  type: string;
}) => {
  const { user, isLoaded } = useUser();
  const name = user?.fullName || user?.firstName || "User";

  const [status, setStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  if (!isLoaded) return null;

  const messages = [
    "What is your greatest strength?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "Where do you see yourself in 5 years?",
  ];

  const lastMessage = messages[messages.length - 1];
  const isSpeaking = true;

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-6">

      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full">

        {/* AI Card */}
        <div className="w-full max-w-md bg-secondary border rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center justify-center">

            <div className="relative flex items-center justify-center">
              {isSpeaking && (
                <span className="absolute w-60 h-60 sm:w-72 sm:h-72 
                                 rounded-full bg-blue-500/20
                                 animate-pulse blur-xl opacity-60 z-0" />
              )}

              <img
                src="/int.png"
                alt="AI Avatar"
                className={cn(
                  "w-40 h-40 sm:w-48 sm:h-48 rounded-full relative z-10",
                  isSpeaking && "animate-pulse"
                )}
              />
            </div>

            <h3 className="text-primary text-lg sm:text-xl font-bold mt-6">
              AI Interviewer
            </h3>
          </div>
        </div>

        {/* User Card */}
        <div className="w-full max-w-md bg-secondary border rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center justify-center">

            <div className="relative flex items-center justify-center">
              {isSpeaking && (
                <span className="absolute w-60 h-60 sm:w-72 sm:h-72 
                                 rounded-full bg-blue-500/20
                                 animate-pulse blur-xl opacity-60 z-0" />
              )}

              <img
                src={user?.imageUrl || "/profile.svg"}
                alt="profile"
                className={cn(
                  "w-40 h-40 sm:w-48 sm:h-48 rounded-full relative z-10 transition-all duration-300",
                  isSpeaking && "animate-pulse"
                )}
              />
            </div>

            <h3 className="text-primary text-lg sm:text-xl font-bold mt-6">
              {name}
            </h3>
          </div>
        </div>
      </div>

      {/* Message Box */}
      {messages.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-10 bg-secondary border rounded-lg shadow-md p-4">
          <p
            key={lastMessage}
            className="text-primary text-center text-base sm:text-lg font-medium animate-fadeIn"
          >
            {lastMessage}
          </p>
        </div>
      )}

      {/* Button */}
      <div className="flex justify-center mt-8 relative">
        {status !== CallStatus.ACTIVE ? (
          <button
            className="relative bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            onClick={() => setStatus(CallStatus.CONNECTING)}
          >
            {status === CallStatus.CONNECTING && (
              <span className="absolute inset-0 rounded-lg bg-green-400 opacity-30 animate-ping" />
            )}
            <span className="relative z-10">
              {status === CallStatus.INACTIVE ||
              status === CallStatus.FINISHED
                ? "Call"
                : "Connecting..."}
            </span>
          </button>
        ) : (
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;