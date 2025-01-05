import { auth } from "@/lib/auth";

import { NextResponse } from "next/server";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPRefix, authRoutes } from "./routes";

const publicApiRoute = ["/api/openai"];
const vendorRoutes = [
  "/dashboard/reviews",
  "/dashboard/generate-code",
  "/dashboard/analytics",
];

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const isVendorLoggedIn = req.auth?.user.role === "VENDOR";

  const isApiAuthRoute =
    nextUrl.pathname.startsWith(apiAuthPRefix) ||
    publicApiRoute.includes(nextUrl.pathname);
  const isPublicRoute = nextUrl.pathname.includes("/");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isVendorRoute = vendorRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/signin", nextUrl));
  }

  if (!isVendorLoggedIn && isVendorRoute) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
