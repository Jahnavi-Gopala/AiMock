import React from 'react'
import Agent from '../components/Agent'

const interviewRoom = () => {
  return (
    <>
      <h3 className='text-2xl font-bold ml-12'>Interview Generation</h3>
      <Agent userName="you" userId="user1" type="generate" />
    </>
  )
}

export default interviewRoom