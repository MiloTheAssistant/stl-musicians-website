import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const canonicalHost = "stl-musicians.com";
const fallbackHosts = new Set(["stl-musicians-website.vercel.app"]);

export function isProtectedDashboardPath(pathname: string) {
  return /^\/dashboard\/[^/]+(?:\/.*)?$/.test(pathname);
}

export function getCanonicalRedirectUrl(requestUrl: string, host?: string) {
  const url = new URL(requestUrl);
  const requestHost = (host ?? url.host).toLowerCase();

  if (!fallbackHosts.has(requestHost)) {
    return null;
  }

  url.protocol = "https:";
  url.host = canonicalHost;
  return url;
}

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export function shouldRunClerkProtection(pathname: string) {
  return isProtectedDashboardPath(pathname);
}

const protectedDashboardProxy = clerkMiddleware(async (auth, req) => {
  await auth.protect({
    unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
  });
});

export function proxy(req: NextRequest, event: NextFetchEvent) {
  const canonicalUrl = getCanonicalRedirectUrl(
    req.url,
    req.headers.get("host") ?? undefined,
  );

  if (canonicalUrl) {
    return NextResponse.redirect(canonicalUrl);
  }

  if (hasClerkEnv && shouldRunClerkProtection(req.nextUrl.pathname)) {
    return protectedDashboardProxy(req, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
