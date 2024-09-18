"use server"
import type { Stripe } from "stripe"
import { backendClient } from "@/lib/edgestore-server"
import { sql } from "@vercel/postgres"
import { getSession } from "@/lib/session"
import { getProducts } from "@/lib/stripe"

export type GalleryImage = {
  url: string
  thumbnailUrl: string | null
  size: number
  uploadedAt: Date
  metadata: Record<string, never>
  path: Record<string, never>
}

export async function getGalleryImageUrls(
  amount: number
): Promise<{ items: Array<GalleryImage>; more: boolean }> {
  try {
    const imageUrls: Array<GalleryImage> = []
    let page = 1
    let remaining = amount
    let canRequestMore = false
    while (imageUrls.length < amount) {
      const res = await backendClient.myPublicImage.listFiles({
        pagination: {
          currentPage: page,
          pageSize: Math.min(remaining, 100),
        },
      })

      if (res.data.length === 0) break

      imageUrls.push(...res.data)

      remaining -= Math.min(remaining, 100)
      const nextPage = res.pagination.currentPage < res.pagination.totalPages

      if (remaining <= 0 || !nextPage) {
        canRequestMore = nextPage
        break
      }

      page++
    }
    return { items: imageUrls, more: canRequestMore }
  } catch (error) {
    console.error(error)
    throw new Error("server error retrieving images")
  }
}

export async function getShopProducts() {
  let products: Stripe.Product[] = []
  let more = true
  let startingAfter: string | undefined = undefined

  while (more) {
    const response: Stripe.Response<Stripe.ApiList<Stripe.Product>> =
      await getProducts({
        limit: 100,
        starting_after: startingAfter,
      })

    const filteredProducts = response.data.filter(
      (product) =>
        !product.metadata.type || product.metadata.type !== "Event Ticket"
    )

    products = products.concat(filteredProducts)

    more = response.has_more
    startingAfter =
      response.data.length > 0
        ? response.data[response.data.length - 1].id
        : undefined
  }

  return products
}

export async function getEvents(amount: number) {
  let events: Stripe.Product[] = []
  let more = true
  let canRequestMore = false
  let startingAfter: string | undefined = undefined

  while (more && events.length < amount) {
    const response: Stripe.Response<Stripe.ApiList<Stripe.Product>> =
      await getProducts({
        limit: 100,
        starting_after: startingAfter,
      })

    const filteredProducts = response.data.filter(
      (product) => product.metadata.type === "Event Ticket"
    )

    events = events.concat(filteredProducts)

    more = response.has_more
    startingAfter =
      response.data.length > 0
        ? response.data[response.data.length - 1].id
        : undefined

    if (events.length >= amount) {
      canRequestMore = more || filteredProducts.length + events.length > amount
      events = events.slice(0, amount)
      more = false
    }
  }
  return { events: events, canRequestMore: canRequestMore }
}

export async function getStripeCustomerId(): Promise<string> {
  try {
    const session = await getSession()
    if (!session) return ""
    const customer =
      await sql`SELECT customer_id FROM customers WHERE user_id = ${session?.user?.id}`
    return customer.rows?.[0]?.customer_id
  } catch (error) {
    throw error
  }
}

export async function storeStripeCustomer(customerId: string) {
  try {
    const session = await getSession()
    const userId = session?.user?.id
    await sql`INSERT INTO customers (customer_id, user_id) VALUES (${customerId}, ${userId}) ON CONFLICT (customer_id, user_id) DO NOTHING`
  } catch (error) {
    throw error
  }
}

export async function validLoginCheckoutToken(token: string) {
  try {
    const validToken =
      await sql`SELECT 1 FROM checkout_tokens WHERE token = ${token}`
    if (validToken.rows.length === 1) {
      await sql`DELETE FROM checkout_tokens WHERE token = ${token}`
      return true
    }
    return false
  } catch (error) {
    throw error
  }
}
