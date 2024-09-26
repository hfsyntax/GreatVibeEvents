"use client"
import type { FormEvent } from "react"
import type { Product } from "@/components/shop/Products"
import { useEffect, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"

export default function CheckoutPage({
  product,
  productVariant,
  amount,
  quantity,
}: {
  product: Product
  productVariant: string | null
  amount: number
  quantity: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const productType = product.metadata.type
    ? product.metadata.type
    : "no product type"
  const [errorMessage, setErrorMessage] = useState<string>()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements) return
    const { error: submitError } = await elements.submit()

    if (submitError) {
      setErrorMessage(submitError.message)
      return setLoading(false)
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_URL}/payment-success?payment=${amount}`,
      },
    })

    if (error) {
      setErrorMessage(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    console.log(amount)
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        productId: product.id,
        productName: product.name,
        productType: productType,
        productVariant: productVariant,
        quantity: quantity,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [amount])

  // stripe loading...
  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-white p-2">
      {clientSecret && <PaymentElement />}
      {errorMessage && <p>{errorMessage}</p>}
      <button
        disabled={!stripe || loading}
        className="mt-2 w-full rounded-md bg-black p-5 font-bold text-white disabled:animate-pulse disabled:opacity-50"
      >
        {!loading
          ? `Pay $${parseFloat(String(amount / 100)).toFixed(2)}`
          : "Processing..."}
      </button>
    </form>
  )
}
