"use server"
import { Product } from "@/types"
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE SECRET KEY is not defined!")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function getPaymentIntent(
  paymentIntent: string,
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntent)
  } catch (error) {
    throw error
  }
}

export async function createPaymentIntent(
  params: Stripe.PaymentIntentCreateParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  try {
    return await stripe.paymentIntents.create(params, options)
  } catch (error) {
    throw error
  }
}

export async function updatePaymentIntent(
  id: string,
  params?: Stripe.PaymentIntentUpdateParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  try {
    return await stripe.paymentIntents.update(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function listPrices(
  params?: Stripe.PriceListParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.ApiListPromise<Stripe.Price>> {
  try {
    return await stripe.prices.list(params, options)
  } catch (error) {
    throw error
  }
}

export async function createCustomer(
  params?: Stripe.CustomerCreateParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.Customer>> {
  try {
    return await stripe.customers.create(params, options)
  } catch (error) {
    throw error
  }
}

export async function getCustomer(
  id: string,
  params?: Stripe.CustomerRetrieveParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
  try {
    return await stripe.customers.retrieve(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function getCustomerIdByEmail(userEmail: string) {
  try {
    const existingCustomer = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })
    if (existingCustomer.data.length > 0) {
      const customer = existingCustomer.data[0]
      if (customer.deleted) return null
      return customer.id
    }
    return null
  } catch (error) {
    throw error
  }
}

export async function getProduct(
  id: string,
  params?: Stripe.ProductRetrieveParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.Product>> {
  try {
    return await stripe.products.retrieve(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function getProductPrice(
  id: string,
  params?: Stripe.PriceRetrieveParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.Response<Stripe.Price>> {
  try {
    return await stripe.prices.retrieve(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function getProductByPriceId(priceId: string) {
  try {
    const price = await stripe.prices.retrieve(priceId)
    const product = await stripe.products.retrieve(String(price.product))
    const plainProduct: Product = {
      id: product.id,
      name: product.name,
      images: product.images,
      created: product.created,
      description: product.description,
      deleted:
        "deleted" in product ||
        !product.active ||
        !price.active ||
        "deleted" in price,
    }
    return { product: plainProduct, amount: price.unit_amount }
  } catch (error) {
    return null
  }
}

export async function getProducts(
  params?: Stripe.ProductListParams,
  options?: Stripe.RequestOptions,
): Promise<Stripe.ApiListPromise<Stripe.Product>> {
  try {
    return await stripe.products.list(params, options)
  } catch (error) {
    throw error
  }
}

export async function getCheckoutSession(checkoutSessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(checkoutSessionId)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function listPurchasedProducts(checkoutSessionId: string) {
  try {
    const productList = await stripe.checkout.sessions.listLineItems(
      checkoutSessionId,
      { limit: 100 },
    )

    const plainProducts = productList.data.map((item) => ({
      product: item.price?.product,
      quantity: item.quantity,
      nickname: item.price?.nickname,
    }))

    const productPromises = plainProducts.map(
      async ({ product, quantity, nickname }) => {
        const stripeProduct = await stripe.products.retrieve(String(product))
        return { ...stripeProduct, quantity, nickname }
      },
    )

    const products = await Promise.all(productPromises)
    return products
  } catch (error) {
    console.error(error)
    throw error
  }
}
