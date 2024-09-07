"use server"
import type { QueryResultRow } from "@vercel/postgres"
import { backendClient } from "@/lib/edgestore-server"
import { sql } from "@vercel/postgres"
import { getSession } from "@/lib/session"

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

export async function getEvents(amount: number) {
  try {
    const events = await sql`SELECT * FROM events ORDER BY date DESC`
    return events.rows
  } catch (error) {
    return [] as Array<QueryResultRow>
  }
}

export async function getEventById(id: string) {
  try {
    const events = await sql`SELECT * from events WHERE id = ${id}`
    return events.rows?.[0]
  } catch (error) {
    throw error
  }
}

export async function getEventPayment(
  eventId: number
): Promise<QueryResultRow> {
  try {
    const customerId = await getStripeCustomerId()
    const paymentIntent =
      await sql`SELECT payment_intent, form_completed FROM event_payments WHERE customer_id = ${customerId} AND event_id = ${eventId}`
    return paymentIntent.rows?.[0]
  } catch (error) {
    console.error(error)
    throw error
  }
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

export async function storeEventPayment(
  paymentIntent: string,
  eventId: number
) {
  try {
    const customerId = await getStripeCustomerId()
    const session = await getSession()
    const userId = session?.user?.id
    await sql`INSERT INTO event_payments (payment_intent, customer_id, event_id) VALUES (${paymentIntent}, ${customerId}, ${eventId}) ON CONFLICT (customer_id, event_id) DO NOTHING`
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
