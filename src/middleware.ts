import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Cron routes require CRON_SECRET header
    if (pathname.startsWith("/api/cron")) {
      const cronSecret = req.headers.get("authorization");
      if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes
        if (
          pathname === "/" ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/inregistrare") ||
          pathname.startsWith("/orar") ||
          pathname.startsWith("/antrenori") ||
          pathname.startsWith("/pachete") ||
          pathname.startsWith("/galerie") ||
          pathname.startsWith("/noutati") ||
          pathname.startsWith("/despre") ||
          pathname.startsWith("/contact") ||
          pathname.startsWith("/feedback") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/contact") ||
          pathname.startsWith("/api/feedback") ||
          pathname.startsWith("/_next") ||
          pathname.includes(".")
        ) {
          return true;
        }

        // Protected routes need auth
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
