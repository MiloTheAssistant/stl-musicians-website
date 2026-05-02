import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

export const proxy = hasClerkEnv
  ? clerkMiddleware(async (auth, req) => {
      const canonicalUrl = getCanonicalRedirectUrl(
        req.url,
        req.headers.get("host") ?? undefined,
      );

      if (canonicalUrl) {
        return NextResponse.redirect(canonicalUrl);
      }

      if (hasClerkEnv && isProtectedDashboardPath(req.nextUrl.pathname)) {
        await auth.protect({
          unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
        });
      }
    })
  : function proxy(req: { headers: Headers; url: string }) {
      const canonicalUrl = getCanonicalRedirectUrl(
        req.url,
        req.headers.get("host") ?? undefined,
      );

      if (canonicalUrl) {
        return NextResponse.redirect(canonicalUrl);
      }

      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
