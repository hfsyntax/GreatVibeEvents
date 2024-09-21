import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getStripeCustomerId, storeStripeCustomer } from "@/actions/server"
import { createCustomer, createPaymentIntent, getCustomer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "401 Unauthorized" }, { status: 401 })
    }
    const { amount, productId, productName, productType, productVariant } =
      await request.json()
    if (
      !amount ||
      !productId ||
      !productName ||
      !productType ||
      !productVariant
    ) {
      return NextResponse.json({ error: "400 Bad Request" }, { status: 400 })
    }
    const existingCustomerId = await getStripeCustomerId()
    let customer
    if (!existingCustomerId) {
      customer = await createCustomer({
        email: session?.user?.email,
        name: `${session?.user?.firstName} ${session?.user?.lastName}`,
      })
    } else {
      customer = await getCustomer(existingCustomerId).catch(async (error) => {
        if (
          error.type === "StripeInvalidRequestError" &&
          error.raw.code === "resource_missing"
        ) {
          return await createCustomer({
            email: session?.user?.email,
            name: `${session?.user?.firstName} ${session?.user?.lastName}`,
          })
        } else {
          throw new Error(error)
        }
      })
    }

    if (!existingCustomerId) storeStripeCustomer(customer.id)

    const paymentIntent = await createPaymentIntent({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      description: "EventTicket",
      metadata: {
        productId: productId,
        productName: productName,
        productType: productType,
        productVariant: productVariant,
        userId: session.user.id,
        formCompleted: "false",
      },
    })
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: `Error: Internal server error: ${error}` },
      { status: 500 },
    )
  }
}
