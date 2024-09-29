"use client"
import type { Product } from "@/types"
import { createContext, useContext, useState } from "react"

interface CheckoutData {
  product: Product | null
  variants: Array<Product> | null
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
    product: null,
    variants: null,
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
