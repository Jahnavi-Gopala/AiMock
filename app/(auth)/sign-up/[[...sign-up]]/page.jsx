import { SignUp } from '@clerk/nextjs'

const page = () => {
  return <SignUp forceRedirectUrl="/onboarding" />
}

export default page