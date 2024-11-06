import { NextResponse } from "next/server";

export default function middleware(request) {
  const path = request.nextUrl.pathname;  
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";
  const token = request.cookies.get("token")?.value || "";
  if (isPublicPath && token ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: ["/", "/login", "/signup", "/manager/postjobs", "/manager", "/manager/fetch_candidates", 
  //   "/manager/update_interview_status", "/manager/assign_interview_date", "/manager/selected_candidates" , "/manager/end_result",
  //   "/candidate", "/candidate/fetch_jobs", "/candidate/applied_jobs", "/candidate/final_result"
  // ],

  matcher: ["/", "/login", "/signup", "/manager/:path*", "/candidate/:path*"]
};
