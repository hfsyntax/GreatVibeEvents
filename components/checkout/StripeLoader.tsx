"use client"
import { useCallback, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { getCheckoutData } from "@/lib/session"
import type { Session, CheckoutData } from "@/types"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function StripeLoader({
  session,
  checkoutData,
}: {
  session: Session | null
  checkoutData: CheckoutData | null
}) {
  const [error, setError] = useState<boolean>(false)
  const fetchClientSecret = useCallback(async () => {
    try {
      let currentCheckoutData: CheckoutData | null = checkoutData
      if (!session) {
        const guestCheckoutData = sessionStorage.getItem("shopData")
        if (guestCheckoutData) {
          currentCheckoutData = await getCheckoutData(guestCheckoutData)
        }
      }

      if (!currentCheckoutData) return setError(true)

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCheckoutData),
      })
      if (!response.ok) {
        return setError(true)
      }
      const responseJson = await response.json()
      return responseJson.clientSecret
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }, [])

  const options = { fetchClientSecret }

  return !error ? (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  ) : (
    <span className="text-red-500">invalid checkout data</span>
  )
}
