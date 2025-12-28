import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Login page ko hamesha allow karo
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // 🔒 Baaki admin routes protect karo
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
