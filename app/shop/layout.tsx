import type { ReactNode } from "react"
import { CheckoutDataProvider } from "@/context/CheckoutDataProvider"
export default function ShopLayout({ children }: { children: ReactNode }) {
  return <CheckoutDataProvider>{children}</CheckoutDataProvider>
}
