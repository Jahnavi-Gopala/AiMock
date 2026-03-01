import React from 'react'
import Agent from '../components/Agent'
import { get } from 'http'
import { getCurrentUser } from '../../../../actions/ai-interview'

const interviewRoom = async () => {

  const user = await getCurrentUser();

  return (
    <>
      <h3 className='text-2xl font-bold ml-12'>Interview Generation</h3>
      <Agent userName={user?.fullName || user?.firstname || user?.username || "User"} userId={user?.clerkId} type="generate" />
    </>
  )
}

export default interviewRoom