import { NextResponse, type NextRequest } from "next/server";
import { createClient, updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const {user, response} =  await updateSession(request);
  console.log(user)
  console.log(request.nextUrl.pathname)

  if (request.nextUrl.pathname.startsWith('/admin/') && !user) {
      return NextResponse.redirect(new URL('/admin', request.url))
  }



  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
