import { NextRequest, NextResponse } from "next/server"
import { updateSession, getSession, getEventTicket } from "@/lib/session"
import { getProduct } from "@/lib/stripe"

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|static-assets|img|profile_pictures|http|https).*)",
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const response = await updateSession(request)
  const session = await getSession()
  console.log(`pathname is ${pathname}`)
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  } else if (!session && pathname === "/checkout") {
    const eventTicket = searchParams.get("eventTicket")
    if (eventTicket) {
      return NextResponse.redirect(
        new URL(
          `/login?redirect=checkout&eventTicket=${eventTicket}`,
          request.url,
        ),
      )
    }
    return response
  } else if (!session && pathname === "/profile") {
    return NextResponse.redirect(new URL("/", request.url))
  } else {
    return response
  }
}
