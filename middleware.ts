import { NextRequest, NextResponse } from "next/server"
import { updateSession, getSession } from "@/lib/session"
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
    const productId = searchParams.get("product_id")
    if (productId) {
      try {
        const product = await getProduct(productId)
        if (product.metadata.type === "Event Ticket") {
          return NextResponse.redirect(
            new URL(
              `/login?redirect=checkout&product_id=${productId}`,
              request.url,
            ),
          )
        }
        return response
      } catch (error: any) {
        if (error.type === "StripeInvalidRequestError") {
          return response
        }
        throw error
      }
    }
  } else {
    return response
  }
}
