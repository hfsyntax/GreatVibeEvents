import { getUserEventForm, storeUserEventForms } from "@/actions/server"
import SuccessHandler from "@/components/payment-success/SuccessHandler"
import { getCheckoutSession, listPurchasedProducts } from "@/lib/stripe"
export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  try {
    if (!searchParams.session_id) {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    const checkoutSession = await getCheckoutSession(searchParams.session_id)

    if (!checkoutSession || checkoutSession.status === "expired") {
      return <span className="text-red-500">Invalid payment data.</span>
    }

    const amount = checkoutSession.amount_total ?? 0

    const purchasedProducts = await listPurchasedProducts(
      searchParams.session_id,
    )

    const eventTickets = purchasedProducts.filter(
      (product) => product.metadata.type === "Event Ticket",
    )

    let totalTickets = 0
    for (let ticket of eventTickets) {
      if (ticket.quantity && ticket.nickname) {
        if (ticket.nickname.includes("2 Participants")) {
          totalTickets += 2 * ticket.quantity
        } else {
          totalTickets += ticket.quantity
        }
      }
    }

    let userTicketAlreadyStored = false
    if (totalTickets > 0) {
      const previousTicket = await getUserEventForm(
        String(checkoutSession.payment_intent),
      )
      if (!previousTicket) {
        await storeUserEventForms(
          totalTickets,
          String(checkoutSession.payment_intent),
        )
      }
    }

    return (
      <main className="m-10 mx-auto max-w-6xl rounded-md border bg-black p-10 text-center text-white">
        <div className="mb-10">
          <h1 className="mb-2 text-4xl font-extrabold">Payment completed</h1>
          <h2 className="text-2xl">You successfully sent</h2>
          <div className="mb-2 mt-5 rounded-md bg-white p-2 text-4xl font-bold text-black">
            ${amount / 100}
          </div>
          <span>
            Payment Reference: {String(checkoutSession.payment_intent)}
          </span>

          <>
            {eventTickets.length > 0 && (
              <span className="mt-5 block text-2xl">
                do not close this window, redirecting to Participation and
                Release Form...
              </span>
            )}
            <SuccessHandler
              payment_intent={String(checkoutSession.payment_intent)}
              redirectToForm={eventTickets.length > 0 ? true : false}
              eventTicketCount={
                !userTicketAlreadyStored ? eventTickets.length : 0
              }
            />
          </>
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
