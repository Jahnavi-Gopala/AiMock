import React from 'react'
import { getUserOnboardingStatus } from '../../../actions/user'
import { redirect } from 'next/navigation'
import { getIndustryInsights } from '../../../actions/dasboard'
import DashboardView from './_components/DashboardView'

const IndustryInsightsPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus();
    const insights = await getIndustryInsights();

    if(!isOnboarded){
        redirect("/onboarding");
    };
  return (
    <div className='px-5'>
      <DashboardView insights={insights}/>
    </div>
  )
}

export default IndustryInsightsPage