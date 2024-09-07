"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToForm({
  payment_intent,
}: {
  payment_intent: string
}) {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push(`/form?payment_intent=${payment_intent}`)
    }, 3000)
  }, [])
  return null
}
