"use client"
import { deleteCheckoutData } from "@/lib/session"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessHandler({
  payment_intent,
  redirectToForm,
  eventTicketCount,
}: {
  payment_intent: string
  redirectToForm: boolean
  eventTicketCount: number
}) {
  const { setData, eventForms, setEventForms } = useCheckoutDataContext()
  const router = useRouter()
  useEffect(() => {
    deleteCheckoutData().then(() => {
      setData({
        product: null,
        variants: null,
        quantity: null,
        totalProducts: 0,
      })
      if (eventForms > 0) {
        setEventForms((prevForms) => prevForms + eventTicketCount)
      }
      if (redirectToForm) {
        setTimeout(() => {
          router.push(`/form?payment_intent=${payment_intent}`)
        }, 3000)
      }
    })
  }, [])
  return null
}
