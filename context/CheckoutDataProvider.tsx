"use client"
import type { ProductVariant } from "@/actions/server"
import { createContext, useContext, useState } from "react"

interface CheckoutData {
  productName: string | null
  variant: ProductVariant | null
  quantity: number | null
}

interface CheckoutDataContextType {
  data: CheckoutData
  setData: React.Dispatch<React.SetStateAction<CheckoutData>>
}

const CheckoutDataContext = createContext<CheckoutDataContextType | undefined>(
  undefined,
)

export const CheckoutDataProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  let [data, setData] = useState<CheckoutData>({
    productName: "",
    variant: null,
    quantity: null,
  })

  return (
    <CheckoutDataContext.Provider value={{ data, setData }}>
      {children}
    </CheckoutDataContext.Provider>
  )
}

export const useCheckoutDataContext = () => {
  const context = useContext(CheckoutDataContext)
  if (!context) {
    throw new Error(
      "useCheckoutDataContext must be used within a CheckoutDataProvider",
    )
  }
  return context
}
