import {
  getStripeCustomerId,
  storeStripeCustomer,
  updateStripeCustomer,
} from "@/actions/server"
import { getSession } from "@/lib/session"
import {
  getProductPrice,
  getProduct,
  createCustomer,
  getCustomerIdByEmail,
} from "@/lib/stripe"
import { CheckoutData } from "@/types"
import { NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    // Create Checkout Sessions from body params.
    const { products, tip }: CheckoutData = await request.json()
    if (
      products.some((product) => !product.priceId || !product.quantity) ||
      products.length === 0
    ) {
      return NextResponse.json({ error: "400 Bad Request" }, { status: 400 })
    }

    const eventProducts = products.filter(
      (product) => product?.metadata?.type === "Event Ticket",
    )

    const totalTickets = eventProducts.reduce((total, product) => {
      // Check if the product's description includes "2 Participants"
      if (
        product.description &&
        product.description.includes("2 Participants")
      ) {
        return total + product.quantity + 1
      }

      return total + product.quantity
    }, 0)

    const session = await getSession()

    if (
      products.some((product) => product?.metadata?.type === "Event Ticket") &&
      !session
    ) {
      return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 })
    }

    let customerId = null
    if (session) {
      // customer in stripe
      customerId = await getCustomerIdByEmail(session.user.email)
      if (!customerId) {
        const addressParts = String(session.user.address).split(",")
        const stateAndZip = addressParts[2].trim().split(" ")
        const state = stateAndZip[0]
        const zip = stateAndZip[1]
        const cityName = addressParts[1].trim()
        const street = addressParts[0].trim()
        const customer = await createCustomer({
          email: session.user.email,
          name: `${session.user.firstName} ${session.user.lastName}`,
          phone: session.user.number ? `+1${session.user.number}` : undefined,
          address: {
            city: cityName,
            state: state,
            country: "US",
            postal_code: zip,
            line1: street,
          },
        })
        customerId = customer.id
      }
      // store/update customer id ref in db
      const customerIdInDb = await getStripeCustomerId()
      if (!customerIdInDb) {
        await storeStripeCustomer(customerId)
      }
      if (customerIdInDb && customerId !== customerIdInDb) {
        await updateStripeCustomer(customerId)
      }
    }

    type CheckoutSessionObject = {
      ui_mode: "embedded"
      line_items: Array<{
        price?: string
        quantity?: number
        price_data?: {
          currency: string
          product_data: {
            name: string
          }
          unit_amount: number
        }
      }>
      mode: "payment"
      phone_number_collection: {
        enabled: boolean
      }
      shipping_address_collection: {
        allowed_countries: ["US"]
      }
      customer?: string
      payment_intent_data?: {
        metadata?: {
          [key: string]: string
        }
      }
      return_url: string
    }

    const sessionObject: CheckoutSessionObject = {
      ui_mode: "embedded",
      line_items: [
        ...products.map((product) => ({
          price: product.priceId,
          quantity: product.quantity,
        })),
        ...(tip
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "Tip",
                  },
                  unit_amount: tip,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      mode: "payment",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      ...(customerId !== null && { customer: customerId }),
      ...(eventProducts && {
        payment_intent_data: {
          metadata: {
            userId: String(session?.user.id),
            eventId: eventProducts[0]?.metadata?.productId ?? "none",
            ticketCount: String(totalTickets),
            formCompleted: "false",
          },
        },
      }),
      return_url: `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionObject)

    return NextResponse.json({
      clientSecret: checkoutSession.client_secret,
      sessionId: checkoutSession.id,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.searchParams)
    const sessionId = searchParams.get("session_id")
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details.email,
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 },
    )
  }
}
