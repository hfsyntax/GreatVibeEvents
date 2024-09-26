"use client"
import type { Product } from "@/components/shop/Products"
import type { CheckoutData } from "@/lib/session"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState, useRef } from "react"
import CheckoutPage from "@/components/checkout/CheckoutPage"
import { getProductPriceName } from "@/actions/server"
import { getCheckoutData } from "@/lib/session"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function StripeLoader({ product }: { product: Product }) {
  const [productType, setProductType] = useState<string>("")
  const [priceData, setPriceData] = useState<CheckoutData>()
  const checkedName = useRef<boolean>(false)
  useEffect(() => {
    getCheckoutData().then((response) => {
      if (response) {
        setPriceData(response)
        getProductPriceName(response.priceId).then((response) => {
          if (response) {
            setProductType(response)
          }
          checkedName.current = true
        })
      }
    })
  }, [])

  if (priceData?.priceId && !checkedName.current) return

  return priceData &&
    priceData.amount > 0 &&
    priceData.priceId &&
    priceData.productId ? (
    <main className="xl:w-6xl m-10 mx-auto w-full rounded-md border bg-black p-10 text-center text-white">
      <div className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold">
          {product.name} x{priceData.quantity}
        </h1>
        {product.metadata.starts &&
          product.metadata.ends &&
          product.metadata.address && (
            <h2 className="text-2xl">
              {new Date(Number(product.metadata.starts)).toLocaleDateString()}
              ,&nbsp;
              {new Date(Number(product.metadata.starts)).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              )}
              &nbsp;-&nbsp;
              {new Date(Number(product.metadata.ends)).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              )}
              &nbsp;@{product.metadata.address}
            </h2>
          )}
        <h2 className="mt-2 text-2xl font-bold">
          {product.metadata.type === "Event Ticket"
            ? productType
            : product.metadata?.defaultVariant
              ? productType
                ? `${priceData.variantName} (${productType})`
                : priceData.variantName
              : null}
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: priceData.amount,
          currency: "usd",
        }}
      >
        <CheckoutPage
          amount={priceData.amount}
          quantity={priceData.quantity}
          product={product}
          productVariant={
            product.metadata.type === "Event Ticket"
              ? productType
              : product.metadata?.defaultVariant
                ? productType
                  ? `${priceData.variantName} (${productType})`
                  : `${priceData.variantName}`
                : null
          }
        />
      </Elements>
    </main>
  ) : (
    <span className="text-red-500">Invalid payment data.</span>
  )
}
