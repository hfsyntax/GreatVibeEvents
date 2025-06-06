import { getProduct, listPrices } from "@/lib/stripe"
import { getSession } from "@/lib/session"
import type { Product } from "@/types"
import ProductComponent from "@/components/shop/Product"
import type { Stripe } from "stripe"
import type { Metadata } from "next"
import { getProductVariants } from "@/actions/server"

export const metadata: Metadata = {
  title: "Great Vibe Events - Product View",
  description: "Generated by create next app",
}

export default async function ShopId({ params }: { params: { id: string } }) {
  try {
    let productVariants: Array<Product> = []
    const product = await getProduct(params.id)

    if (product.deleted || !product.active) {
      return <span className="text-red-500">Product has been deleted.</span>
    }

    const plainProduct = {
      images: product.images,
      metadata: product.metadata,
      name: product.name,
      description: product.description,
      created: product.created,
      id: product.id,
    }

    productVariants.push(plainProduct)
    const otherVariants = await getProductVariants(product.id)
    productVariants = productVariants.concat(otherVariants)

    const prices = await Promise.all(
      productVariants.map(async (product) => {
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
      <ProductComponent
        prices={pricesMap}
        variants={productVariants}
        session={session}
      />
    )
  } catch (error: any) {
    console.error(error)
    if (error.type === "StripeInvalidRequestError") {
      return <span className="text-red-500">{error.raw.message}</span>
    } else {
      return <span className="text-red-500">Internal server error</span>
    }
  }
}
