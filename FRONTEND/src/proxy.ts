import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

export const PROTECTED_ROUTES = [
  "/user",
  "/admin",
  "/forum",
  "/partner",
  "/missions",
  "/exchange-market",
];

function stripLocalePrefix(
  pathname: string,
  locales: readonly string[],
): string {
  const segments = pathname.split("/");
  if (locales.includes(segments[1])) {
    return "/" + segments.slice(2).join("/");
  }
  return pathname;
}

function isProtectedRoute(pathname: string, locales: readonly string[]) {
  const cleanPath = stripLocalePrefix(pathname, locales);
  return PROTECTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(route + "/"),
  );
}

function isPublicRoute(pathname: string, locales: readonly string[]) {
  const cleanPath = stripLocalePrefix(pathname, locales);
  return PUBLIC_ROUTES.some((route) => cleanPath === route);
}

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getTokenPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { locales, defaultLocale } = routing;

  // Redirect legacy customer routes to partner routes
  const cleanPathForLegacy = stripLocalePrefix(pathname, locales);
  if (cleanPathForLegacy.startsWith("/customer")) {
    const localePrefix = pathname.split("/")[1];
    const hasLocale = (locales as readonly string[]).includes(localePrefix);
    const newPath = cleanPathForLegacy.replace("/customer", "/partner");
    const targetUrl = new URL(
      hasLocale ? `/${localePrefix}${newPath}` : newPath,
      req.url,
    );
    return NextResponse.redirect(targetUrl);
  }

  const currentLocale = req.cookies.get("NEXT_LOCALE")?.value || defaultLocale;
  const token = req.cookies.get("access_token")?.value;
  const payload = token ? getTokenPayload(token) : null;
  const userRole = payload?.role;

  // Bypass redirects for Admin users accessing partner routes
  const cleanPath = stripLocalePrefix(pathname, locales);
  if (cleanPath.startsWith("/partner") && userRole === "admin") {
    return createMiddleware(routing)(req);
  }

  const hasValidToken = token ? isTokenValid(token) : false;

  if (token && !hasValidToken) {
    let response;
    if (isProtectedRoute(pathname, locales)) {
      const loginUrl = new URL(`/${currentLocale}/login`, req.url);
      response = NextResponse.redirect(loginUrl);
    } else {
      response = createMiddleware(routing)(req);
    }
    response.cookies.delete("access_token");
    return response;
  }

  if (isProtectedRoute(pathname, locales) && !hasValidToken) {
    const loginUrl = new URL(`/${currentLocale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute(pathname, locales) && hasValidToken) {
    const dashboardUrl = new URL(`/${currentLocale}/user/account`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return createMiddleware(routing)(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*", "/((?!api|nestjs|_next|.*\\..*).*)"],
};
