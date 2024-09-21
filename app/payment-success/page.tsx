import { getSession } from "@/lib/session"
import RedirectToForm from "@/components/payment-success/RedirectToForm"
import { getPaymentIntent } from "@/lib/stripe"
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

    const paymentIntent = await getPaymentIntent(payment_intent)
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

    const productVariant = paymentIntent.metadata.productVariant
    const isEventProduct = paymentIntent.metadata.productType === "Event Ticket"

    return (
      <main className="m-10 mx-auto max-w-6xl rounded-md border bg-black p-10 text-center text-white">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-extrabold">
            Payment completed for {productVariant}
          </h1>
          <h2 className="text-2xl">You successfully sent</h2>
          <div className="mt-5 rounded-md bg-white p-2 text-4xl font-bold text-black">
            ${amount / 100}
          </div>
          <span className="mt-5 block text-2xl">
            do not close this window, redirecting to Participation and Release
            Form...
          </span>
          {isEventProduct && <RedirectToForm payment_intent={payment_intent} />}
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
