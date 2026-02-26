"use client"

import React from 'react'
import { useUser } from "@clerk/nextjs";
import { useState } from 'react';
import { cn } from '../new/utils';


enum CallStatus{
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}


const Agent = ( {userName, userId, type}: {userName: string, userId: string, type: string}) => {
    const { user, isLoaded } = useUser();
    const name = user?.fullName || user?.firstName || "User";

    if (!isLoaded) return null; // wait until Clerk loads

    const [status, setStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    const messages =[
        'What is your greatest strength?',
        'Can you describe a challenging situation you faced at work and how you handled it?',
        'Where do you see yourself in 5 years?',
    ]

    const LastMessage = messages[messages.length - 1];

    const isSpeaking = true; 

  return (
    <>
    <div className='px-10'>
        <div className='cards flex flex-row justify-center items-center w-full gap-8'>
            <div className=' border bg-secondary rounded-lg shadow-md h-120 w-170'>
                <div className='flex flex-col items-center justify-center h-full'>
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        {isSpeaking && (
                            <span className="absolute w-75 h-75 
                                            rounded-full
                                            animate-pulse
                                            blur-lg
                                            opacity-65
                                            z-0"/>
                        )}
                        <img
                            src="/int.png"
                            alt="Avatar"
                            className={`w-50 h-50 rounded-full relative z-10 ${isSpeaking ? "animate-pulse" : "scale-100"}`}
                        />
                        </div>
                        <h3 className='text-center text-primary text-xl pt-4 font-bold mt-5'>AI Interviewer</h3>
                </div>
            </div>
            <div className='bg-secondary m-10 border border-gray-200 rounded-lg shadow-md h-120 w-170'>
                <div className='flex flex-col items-center justify-center h-full'>
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        {isSpeaking && (
                            <span className="absolute w-75 h-75 
                                            rounded-full
                                            animate-pulse
                                            blur-lg
                                            opacity-65
                                            z-0"/>
                        )}

                        <img
                            src={user?.imageUrl || "/profile.svg"}
                            alt="profile"
                            className={`w-50 h-50  rounded-full relative z-10 transition-all duration-300 ${
                                isSpeaking ? "animate-pulse" : "scale-100"
                            }`}
                            />
                        </div>
                        <h3 className='text-center text-primary text-xl pt-4 font-bold mt-5'>{name}</h3>
                </div>
            </div>
        </div>

            {messages.length > 0 && (
                <div className='bg-secondary border border-gray-800 rounded-lg shadow-md h-20 w-345  items-center justify-center mb-3 '>
                    <div className='font-medium text-primary text-lg text-center mt-5 '>
                        <p key={LastMessage} className={cn('transition-opacity duration-500 opacity-0',' animate-fadeIn, opacity-100')}>
                            {LastMessage}
                        </p>
                    </div>
                </div>
            )}

        <div className='w-full flex justify-center'>
            { status !== CallStatus.ACTIVE ?( 
                    <button className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'
                        onClick={() => setStatus(CallStatus.CONNECTING)} >
                        <span className={cn('absolute animate-ping rounded-full bg-green-400 opacity-75', status === CallStatus.CONNECTING && "hidden")}/>
                        <span>
                            {status === CallStatus.INACTIVE || status === CallStatus.FINISHED ? "Call" : "..."}
                        </span>
                    </button>
            ):(
                <button className='bg-red-500 text-white px-4 py-2 rounded-lg'>
                    End
                </button>
            ) }
        </div>
    </div>
    </>
  )
}

export default Agent