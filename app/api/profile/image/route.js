import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

export const runtime = "nodejs";        // REQUIRED
export const dynamic = "force-dynamic"; // avoid caching

// Create Clerk server client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// ---------- GET (fetch profile image) ----------
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);

    return Response.json({
      imageUrl: user.imageUrl || null,
    });
  } catch (err) {
    console.error("GET profile image error:", err);
    return new Response("Server error", { status: 500 });
  }
}

// ---------- POST (upload profile image) ----------
export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new Response("Invalid file", { status: 400 });
    }

    await clerkClient.users.updateUserProfileImage(userId, { file });

    return new Response("Uploaded", { status: 200 });
  } catch (err) {
    console.error("POST profile image error:", err);
    return new Response("Upload failed", { status: 500 });
  }
}
