import type { Stripe } from "stripe"
import type { Metadata } from "next"
import { getShopProducts } from "@/actions/server"
import Products from "@/components/shop/Products"
import { listPrices } from "@/lib/stripe"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Great Vibe Events - Shop",
  description: "Generated by create next app",
}

export default async function Shop() {
  const items = await getShopProducts()
  // convert stripe object to generic object for prop pass to client component
  const plainItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    metadata: item.metadata,
    images: item.images,
    created: item.created,
  }))

  const prices = await Promise.all(
    plainItems.map(async (product) => {
      const response = await listPrices({ product: product.id, limit: 100 })
      return { id: product.id, prices: response.data }
    }),
  )

  const pricesMap: { [key: string]: Stripe.Price[] } = prices.reduce(
    (acc, curr) => {
      acc[curr.id] = curr.prices
      return acc
    },
    {} as { [key: string]: Stripe.Price[] },
  )

  const session = await getSession()

  return (
    <div className="mt-10 flex w-full">
      <Products items={plainItems} prices={pricesMap} session={session} />
    </div>
  )
}
