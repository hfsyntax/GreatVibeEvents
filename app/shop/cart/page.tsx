import type { CartItem } from "@/types"
import { getCheckoutData } from "@/lib/session"
import { getProductByPriceId } from "@/lib/stripe"
import { Open_Sans } from "next/font/google"
import Image from "next/image"
import Cart from "@/components/shop/Cart"

const openSans = Open_Sans({ subsets: ["latin"] })

export default async function CartPage() {
  const checkoutData = await getCheckoutData()
  let products: CartItem = {}
  await Promise.all(
    checkoutData.products.map(async (product) => {
      const stripeProduct = await getProductByPriceId(product.priceId)
      if (stripeProduct) {
        products[product.priceId] = {
          stripeProduct,
          quantity: product.quantity,
        }
      }
    }),
  )
  return Object.keys(products).length === 0 ? (
    <span>Shopping cart is empty</span>
  ) : (
    <Cart products={products} />
  )
}
