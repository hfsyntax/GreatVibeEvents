import { convertToSubcurrency } from "@/lib/utils"
import { getSession } from "@/lib/session"
import RedirectToForm from "@/components/payment-success/RedirectToForm"
import Stripe from "stripe"
export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: { payment?: string; payment_intent?: string }
}) {
  try {
    const { payment, payment_intent } = searchParams
    if (!payment || !payment_intent) {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    if (process.env.STRIPE_SECRET_KEY === undefined) {
      throw new Error("Stripe secret key is not defined!")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
    const amount = Number(payment)

    if (paymentIntent.amount !== amount) {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    const userId = Number(paymentIntent.metadata.userId)
    const session = await getSession()

    if (userId !== session?.user?.id) {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    const paymentExists = paymentIntent.metadata.formCompleted === "true"

    if (paymentExists) {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    const eventName = paymentIntent.metadata.eventName

    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-black">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Payment completed for {eventName}
          </h1>
          <h2 className="text-2xl">You successfully sent</h2>
          <div className="bg-white p-2 rounded-md text-black mt-5 text-4xl font-bold">
            ${amount / 100}
          </div>
          <span className="block text-2xl mt-5">
            do not close this window, redirecting to Participation and Release
            Form...
          </span>
          <RedirectToForm payment_intent={payment_intent} />
        </div>
      </main>
    )
  } catch (error: any) {
    console.error(error)
    if (error.type === "StripeInvalidRequestError") {
      return <span className="text-red-500">{error.raw.message}</span>
    } else {
      return <span className="text-red-500">Internal server error</span>
    }
  }
}
