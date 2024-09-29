import {
  getStripeCustomerId,
  storeStripeCustomer,
  updateStripeCustomer,
} from "@/actions/server"
import { metadata } from "@/app/layout"
import { getCheckoutData, getSession } from "@/lib/session"
import {
  getProductPrice,
  getProduct,
  createCustomer,
  getCustomerIdByEmail,
} from "@/lib/stripe"
import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest) {
  try {
    // Create Checkout Sessions from body params.
    const { priceId, quantity, tip } = await getCheckoutData()
    if (!priceId || !quantity) {
      return NextResponse.json({ error: "400 Bad Request" }, { status: 400 })
    }

    const productPrice = await getProductPrice(priceId)
    const product = await getProduct(String(productPrice.product))
    const session = await getSession()

    if (product.metadata.type === "Event Ticket" && !session) {
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
        {
          price: priceId,
          quantity: quantity,
        },
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
      ...(product.metadata.type === "Event Ticket" && {
        payment_intent_data: {
          metadata: {
            userId: session.user.id,
            productId: product.id,
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = new URL(req.url!)
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
