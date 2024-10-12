"use client"
import { useCallback, useEffect, useState } from "react"
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
  const [error, setError] = useState<boolean | undefined>()
  const fetchClientSecret = useCallback(async () => {
    try {
      let currentCheckoutData: CheckoutData | null = checkoutData
      if (!session) {
        const guestCheckoutData = sessionStorage.getItem("shopData")
        if (guestCheckoutData) {
          currentCheckoutData = await getCheckoutData(guestCheckoutData)
        }
      }

      if (!currentCheckoutData || checkoutData?.products.length === 0) return

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCheckoutData),
      })
      if (!response.ok) {
        return
      }
      const responseJson = await response.json()
      return responseJson.clientSecret
    } catch (err) {
      console.error(err)
    }
  }, [])

  const options = { fetchClientSecret }

  useEffect(() => {
    fetchClientSecret().then((response) => {
      response ? setError(false) : setError(true)
    })
  }, [])

  return error === undefined ? (
    <span>loading...</span>
  ) : !error ? (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  ) : (
    <span className="text-red-500">invalid checkout data</span>
  )
}
