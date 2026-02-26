import React from 'react'
import OnboardingForm from '../onboarding/_components/onboarding-form'
import { industries } from '../../../data/Industries'
import { getUserOnboardingStatus } from '../../../actions/user'
import { redirect } from 'next/navigation'

const OnBoardingPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus();
    if(isOnboarded){
        redirect("/dashboard");
    };
  return (
    <main>
        <OnboardingForm industries={industries} />
    </main>
  )
}

export default OnBoardingPage