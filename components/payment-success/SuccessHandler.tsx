"use client"
import { deleteCheckoutData } from "@/lib/session"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessHandler({
  payment_intent,
  redirectToForm,
}: {
  payment_intent: string
  redirectToForm: boolean
}) {
  const router = useRouter()
  useEffect(() => {
    deleteCheckoutData().then(() => {
      if (redirectToForm) {
        setTimeout(() => {
          router.push(`/form?payment_intent=${payment_intent}`)
        }, 3000)
      }
    })
  }, [])
  return null
}
