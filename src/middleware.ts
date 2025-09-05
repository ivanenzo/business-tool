import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    if (pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    // Redirect to onboarding if not completed
    if (token && !token.onboardingCompleted && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Redirect from onboarding if already completed
    if (token && token.onboardingCompleted && pathname === "/onboarding") {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/employee", req.url));
      }
    }

    // Admin routes protection
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Employee routes protection
    if (pathname.startsWith("/employee")) {
      if (token?.role !== "EMPLOYEE") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
          return true;
        }
        
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};