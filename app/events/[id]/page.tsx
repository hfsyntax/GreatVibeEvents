import Stripe from "stripe"
import Link from "next/link"
export default async function EventId({ params }: { params: { id: string } }) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const product = await stripe.products.retrieve(params.id)
    const eventTime = Number(parseInt(product.metadata.starts))
    if (isNaN(eventTime)) {
      return <span className="text-red-500">Event start time not found</span>
    }
    const now = Date.now()

    if (now > eventTime) {
      return (
        <span className="text-red-500">
          Event ticket is no longer available for purchase.
        </span>
      )
    }
    const priceList = await stripe.prices.list({
      product: params.id,
    })
    return (
      <div className=" text-white flex flex-col gap-2 w-fit items-center mr-auto ml-auto p-3">
        {priceList.data.map((price, index) => (
          <Link
            key={`${params.id}_price_${index}`}
            className="p-3 bg-black text-xs sm:text-sm lg:text-lg"
            href={`/checkout?event_id=${params.id}&price=${price.id}`}
          >
            {price.nickname} ${price.unit_amount && price.unit_amount / 100}
          </Link>
        ))}
      </div>
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
