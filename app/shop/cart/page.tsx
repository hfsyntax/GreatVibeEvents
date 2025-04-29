import type { CartItem } from "@/types"
import { getCheckoutData, getSession } from "@/lib/session"
import { getProductByPriceId } from "@/lib/stripe"
import Cart from "@/components/shop/Cart"

export default async function CartPage() {
  const session = await getSession()
  if (session) {
    let checkoutData = await getCheckoutData()
    checkoutData = checkoutData
      ? checkoutData
      : { products: [], userId: session.user.id }
    let products: CartItem = {}
    await Promise.all(
      checkoutData.products.map(async (product) => {
        const stripeProduct = await getProductByPriceId(product.priceId)
        if (stripeProduct) {
          products[product.priceId] = {
            product: stripeProduct.product,
            amount: stripeProduct.amount,
            quantity: product.quantity,
            tip: product.tip ? product.tip : undefined,
            metadata: product.metadata,
          }
        }
      }),
    )
    return Object.keys(products).length === 0 ? (
      <span>Shopping cart is empty</span>
    ) : (
      <Cart products={products} session={session} />
    )
  }
  return <Cart products={null} session={session} />
}
