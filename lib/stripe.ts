"use server"
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE SECRET KEY is not defined!")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function getPaymentIntent(
  paymentIntent: string
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntent)
  } catch (error) {
    throw error
  }
}

export async function createPaymentIntent(
  params: Stripe.PaymentIntentCreateParams,
  options?: Stripe.RequestOptions
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
  options?: Stripe.RequestOptions
): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  try {
    return await stripe.paymentIntents.update(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function listPrices(
  params?: Stripe.PriceListParams,
  options?: Stripe.RequestOptions
): Promise<Stripe.ApiListPromise<Stripe.Price>> {
  try {
    return await stripe.prices.list(params, options)
  } catch (error) {
    throw error
  }
}

export async function createCustomer(
  params?: Stripe.CustomerCreateParams,
  options?: Stripe.RequestOptions
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
  options?: Stripe.RequestOptions
): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
  try {
    return await stripe.customers.retrieve(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function getProduct(
  id: string,
  params?: Stripe.ProductRetrieveParams,
  options?: Stripe.RequestOptions
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
  options?: Stripe.RequestOptions
): Promise<Stripe.Response<Stripe.Price>> {
  try {
    return await stripe.prices.retrieve(id, params, options)
  } catch (error) {
    throw error
  }
}

export async function getProducts(
  params?: Stripe.ProductListParams,
  options?: Stripe.RequestOptions
): Promise<Stripe.ApiListPromise<Stripe.Product>> {
  try {
    return await stripe.products.list(params, options)
  } catch (error) {
    throw error
  }
}
