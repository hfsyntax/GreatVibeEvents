"use client"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCheckoutDataContext } from "@/context/checkoutDataProvider"
import { useEffect, useState, useRef } from "react"
import CheckoutPage from "@/components/checkout/CheckoutPage"
import { getProductPrice } from "@/lib/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function StripeLoader({
  name,
  eventId,
  starts,
  ends,
  address,
}: {
  name: string
  eventId: string
  starts: number
  ends: number
  address: string
}) {
  const { data } = useCheckoutDataContext()
  const [productType, setProductType] = useState<string>("No name for product")
  const checkedName = useRef<boolean>(false)
  useEffect(() => {
    if (data.priceId) {
      getProductPrice(data.priceId).then((response) => {
        if (response.nickname) {
          setProductType(response.nickname)
        }
        checkedName.current = true
      })
    }
  }, [])

  if (data.priceId && !checkedName.current) return

  return data.amount > 0 && data.priceId && data.productId ? (
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
        <h2 className="text-2xl mt-2 font-bold">{productType}</h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: data.amount,
          currency: "usd",
        }}
      >
        <CheckoutPage
          amount={data.amount}
          eventName={name}
          eventId={eventId}
          productType={productType}
        />
      </Elements>
    </main>
  ) : (
    <span className="text-red-500">Invalid payment data.</span>
  )
}
