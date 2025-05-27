import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all routes except for:
     * - static files
     * - public folder
     * - API routes (if you want to protect them, add them here)
     */
    "/((?!_next|static|favicon.ico|public).*)",
  ],
};