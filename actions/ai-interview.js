import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  try {
    const user = await currentUser();

    if (!user) return null;

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      firstname: user.firstName,
      clerkId: user.clerkId,
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching Clerk user:", error);
    return null;
  }
}