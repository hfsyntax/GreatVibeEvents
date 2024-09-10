"use client"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { convertToSubcurrency, militaryToTime } from "@/lib/utils"
import CheckoutPage from "@/components/checkout/CheckoutPage"

export default function StripeLoader({
  name,
  starts,
  ends,
  address,
  packageName,
  amount,
}: {
  name: string
  starts: number
  ends: number
  address: string
  packageName: string
  amount: number
}) {
  return (
    <main className="w-full xl:w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-black">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{name}</h1>
        <h2 className="text-2xl">
          {new Date(starts).toLocaleDateString()},&nbsp;
          {new Date(starts).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          &nbsp;-&nbsp;
          {new Date(ends).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          &nbsp;@{address}
        </h2>
        <h2 className="text-2xl mt-2 font-bold">{packageName}</h2>
      </div>
      <Elements
        stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)}
        options={{
          mode: "payment",
          amount: amount,
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} eventName={name} />
      </Elements>
    </main>
  )
}
