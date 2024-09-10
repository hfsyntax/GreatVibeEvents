import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getSession } from "@/lib/session"
import { getStripeCustomerId, storeStripeCustomer } from "@/actions/server"

if (process.env.STRIPE_SECRET_KEY === undefined) {
  throw new Error("Stripe secret key is not defined!")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 })
    }
    const { amount, eventId, eventName } = await request.json()
    if (!amount || !eventId || !eventName) {
      return NextResponse.json({ error: "400 Bad Request" }, { status: 400 })
    }
    const existingCustomerId = await getStripeCustomerId()
    let customer
    if (!existingCustomerId) {
      customer = await stripe.customers.create({
        email: session?.user?.email,
        name: `${session?.user?.firstName} ${session?.user?.lastName}`,
      })
    } else {
      customer = await stripe.customers
        .retrieve(existingCustomerId)
        .catch(async (error) => {
          if (
            error.type === "StripeInvalidRequestError" &&
            error.raw.code === "resource_missing"
          ) {
            return await stripe.customers.create({
              email: session?.user?.email,
              name: `${session?.user?.firstName} ${session?.user?.lastName}`,
            })
          } else {
            throw new Error(error)
          }
        })
    }

    if (!existingCustomerId) storeStripeCustomer(customer.id)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      description: "EventTicket",
      metadata: {
        eventId: eventId,
        userId: session.user.id,
        eventName: eventName,
        formCompleted: "false",
      },
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: `Error: Internal server error: ${error}` },
      { status: 500 }
    )
  }
}
