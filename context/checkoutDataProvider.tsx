"use client"
import { createContext, useContext, useState } from "react"

interface CheckoutData {
  priceId: string
  productId: string
  amount: number
}

interface CheckoutDataContextType {
  data: CheckoutData
  setData: React.Dispatch<React.SetStateAction<CheckoutData>>
}

const CheckoutDataContext = createContext<CheckoutDataContextType | undefined>(
  undefined
)

export const CheckoutDataProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  let [data, setData] = useState({
    priceId: "",
    productId: "",
    amount: 0,
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
      "useCheckoutDataContext must be used within a CheckoutDataProvider"
    )
  }
  return context
}
