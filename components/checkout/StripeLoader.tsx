"use client"
import { useCallback, useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js"
import { getCheckoutData } from "@/lib/session"
import type { Session, CheckoutData } from "@/types"
import { getProductByPriceId } from "@/lib/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function StripeLoader({
  session,
  checkoutData,
}: {
  session: Session | null
  checkoutData: CheckoutData | null
}) {
  const [error, setError] = useState<string | undefined>()
  const fetchClientSecret = useCallback(async () => {
    try {
      let currentCheckoutData: CheckoutData | null = checkoutData
      if (!session) {
        const guestCheckoutData = sessionStorage.getItem("shopData")
        if (guestCheckoutData) {
          currentCheckoutData = await getCheckoutData(guestCheckoutData)
        }
      }

      if (!currentCheckoutData || checkoutData?.products.length === 0)
        return setError("Cart is empty.")

      // filter out deleted products
      const updatedProducts = await Promise.all(
        currentCheckoutData.products.map(async (product) => {
          const stripeProduct = await getProductByPriceId(product.priceId)
          if (
            stripeProduct &&
            product.quantity > 0 &&
            !stripeProduct.product.deleted
          ) {
            return product
          } else if (
            product.tip &&
            product.tip > 0 &&
            currentCheckoutData.tip &&
            currentCheckoutData.tip > 0
          ) {
            currentCheckoutData.tip -= product.tip
          }
          return null
        }),
      )

      currentCheckoutData.products = updatedProducts.filter(
        (product) => product !== null,
      )

      if (currentCheckoutData.products.length === 0)
        return setError("Cart is empty.")

      // stripe minimum tip is $0.50
      if (
        (currentCheckoutData.tip && currentCheckoutData.tip < 0) ||
        (currentCheckoutData.tip &&
          currentCheckoutData.tip > 0 &&
          currentCheckoutData.tip < 50)
      ) {
        currentCheckoutData.tip = undefined
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCheckoutData),
      })
      if (!response.ok) {
        return setError("Internal server error.")
      }
      const responseJson = await response.json()
      return responseJson.clientSecret
    } catch (err) {
      setError("Internal server error.")
      console.error(err)
    }
  }, [])

  const options = { fetchClientSecret }

  useEffect(() => {
    fetchClientSecret().then((response) => {
      if (response) {
        setError("")
      }
    })
  }, [])

  return error === undefined ? (
    <span>loading...</span>
  ) : error === "" ? (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  ) : (
    <span className="text-red-500">{error}</span>
  )
}
