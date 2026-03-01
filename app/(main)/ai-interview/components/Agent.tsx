"use client"

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "../new/utils";
import { useRouter } from "next/navigation";
import {vapi} from "../../../../lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: 'user' | 'assistant'| 'system';
  content: string;
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
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  
  const lastMessage = messages[messages.length - 1];
  
  useEffect(() => {
      const onCallStart =() =>{
          setStatus(CallStatus.ACTIVE);
        }
        
        const onCallEnd = () => {
            setStatus(CallStatus.FINISHED);
        }
        
        const onMessage = (message: Message) =>{
            if(message.type === "transcript" && message.transcriptType === "final"){
                const newMessage = { role:message.role, content:message.transcript };
                setMessages((prev) => [...prev, newMessage]);
            }
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        
        const onError = (error: Error) => {
            console.error("Call error:", error);
        }
        
        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);
        
        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);
    useEffect(()=>{
        if(status === CallStatus.FINISHED){
            router.push("/ai-interview");
        }
    },[messages, status, type, userId])
    
    const handleCall = async()=>{
        setStatus(CallStatus.CONNECTING);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_URL!, {
            variableValues:{
                userName : userName,
                userId: userId,
            }
        } )
    }
    
    const  handleDisconnect = () => {
        setStatus(CallStatus.FINISHED);
        vapi.stop();
    }
    
    const latestMessage = messages[messages.length - 1]?.content || "";    
    
    const isCallInactiveOrFinished = status === CallStatus.INACTIVE || status === CallStatus.FINISHED;

    if (!isLoaded) return null;
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
              {userName}
            </h3>
          </div>
        </div>
      </div>

      {/* Message Box */}
      {messages.length > 0 && (
        <div className="w-full max-w-4xl mx-auto mt-10 bg-secondary border rounded-lg shadow-md p-4">
          <p
            key={latestMessage}
            className="text-primary text-center text-base sm:text-lg font-medium animate-fadeIn"
          >
            {latestMessage}
          </p>
        </div>
      )}

      {/* Button */}
      <div className="flex justify-center mt-8 relative">
        {status !== CallStatus.ACTIVE ? (
          <button
            className="relative bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            onClick={handleCall}
          >
            {status === CallStatus.CONNECTING && (
              <span className="absolute inset-0 rounded-lg bg-green-400 opacity-30 animate-ping" />
            )}
            <span className="relative z-10">
              {isCallInactiveOrFinished
                ? "Call"
                : "Connecting..."}
            </span>
          </button>
        ) : (
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;