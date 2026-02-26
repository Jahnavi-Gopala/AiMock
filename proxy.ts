import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
  "/ai-interview(.*)",
])


export default clerkMiddleware(async(auth,req)=>{
  const {userId} = await auth();

  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if(!userId && isProtectedRoute(req)&& !isApiRoute){
    const {redirectToSignIn} = await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});




export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    "/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|svg|ico|json)).*)",
  ],
};