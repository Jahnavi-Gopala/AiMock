
import React from 'react'
import dayjs from 'dayjs'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

const InterviewCard = ({ id, userId, role, type, techstack, createdAt }) => {
    const feedback =
    // userId && id
    // ?  getFeedbackByInterviewId({
    //     interviewId: id,
    //     userId,
    // })
    // : 
    null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    return (
        <div >
            <div className=' bg-secondary rounded-lg w-[360px] max-sm:w-full min-h-96 items-center justify-between flex flex-col p-5'>
                <div >
                    <div  className='flex flex-row gap-5 items-center justify-center'>
                    <div className='flex flex-col items-center justify-center m-5'>
                    <Image src="/tech.svg" alt="Interview Cover" width={60} height={60} className='rounded-full object-fit size-[60px]' />
                    <h3 className='mt-5 text-lg font-bold capitalize  '>
                        {role} Interview
                    </h3>
                    </div>
                    </div>
                    <div  className='px-30'>
                    <div className='flex flex-row gap-5 items-center justify-center rounded-lg bg-primary/50 px-3 py-1 '>
                        <p className='text-sm font-medium'>{normalizedType}</p>
                    </div>
                    </div>
                    <div className='flex flex-row gap-5 mt-3 items-center justify-center'>
                        <div className='flex flex-row gap-2'>
                            <Image src="/calendar.svg" alt="Calendar Icon" width={20} height={20} />
                            <p>{formattedDate}</p>
                        </div>
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <Image src="/star.svg" alt="Star Icon" width={20} height={20} />
                            <p>{feedback?.totalScore || '---'}/100</p>
                        </div>
                    </div>
                    <div>
                    <p className='line-clamp-2 mt-3 items-center justify-center px-7 text-justify'>
                        {feedback?.finalAssessment || "You haven't taken this interview yet.Please start the interview to get feedback."}
                    </p>
                    </div>
                </div>
                <div className='flex flex-row justify-between'>
                    {/* <DisplayTechIcons techstack={techstack}/> */}
                    <Button className='btn-primary'>
                        <Link href={`/ai-interview/${id}/feedback`}>
                        View Feedback
                         </Link>
                    </Button>
                </div>
            </div> 
        </div>
    )
}

export default InterviewCard
