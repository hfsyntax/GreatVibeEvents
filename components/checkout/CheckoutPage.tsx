"use client"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useCheckoutDataContext } from "@/context/checkoutDataProvider"

export default function CheckoutPage({
  amount,
  eventName,
  eventId,
  productType,
}: {
  amount: number
  eventName: string
  eventId: string
  productType: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const { data } = useCheckoutDataContext()
  console.log(data)

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
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount,
        productId: eventId,
        productName: eventName,
        productType: productType,
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
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <p>{errorMessage}</p>}
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading
          ? `Pay $${parseFloat(String(amount / 100)).toFixed(2)}`
          : "Processing..."}
      </button>
    </form>
  )
}
