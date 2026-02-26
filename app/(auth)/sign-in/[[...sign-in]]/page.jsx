import { SignIn } from '@clerk/nextjs'


const page = () => {
  return <SignIn forceRedirectUrl="/onboarding" />
}

export default page