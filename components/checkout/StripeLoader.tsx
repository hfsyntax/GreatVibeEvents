"use client"
import type { QueryResultRow } from "@vercel/postgres"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { convertToSubcurrency, militaryToTime } from "@/lib/utils"
import CheckoutPage from "@/components/checkout/CheckoutPage"

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined!")
}

export default function StripeLoader({ event }: { event: QueryResultRow }) {
  return (
    <main className="w-full xl:w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-black">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{event.name}</h1>
        <h2 className="text-2xl">
          {new Date(event.date).toLocaleDateString()},&nbsp;
          {militaryToTime(event.start_time)}&nbsp;-&nbsp;
          {militaryToTime(event.end_time)}&nbsp;@{event.address}
        </h2>
      </div>
      <Elements
        stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(event.price),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={event.price} eventName={event.name} />
      </Elements>
    </main>
  )
}
