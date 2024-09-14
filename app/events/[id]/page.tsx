import Image from "next/image"
import { getProduct, listPrices } from "@/lib/stripe"
import EventTicket from "@/components/events/EventTicket"
export default async function EventId({ params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id)
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

    const priceList = await listPrices({
      product: params.id,
    })

    const sortedPrices = priceList.data.sort(
      (a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0)
    )
    return (
      <div className="flex flex-col items-center justify-center">
        {product.name.includes("Halloween") && (
          <>
            <Image
              src={"/img/halloween-event.png"}
              height={0}
              width={0}
              sizes="50%, 100%"
              alt="logo_welcome"
              className="w-full lg:w-1/2 h-auto"
              priority
            />
            <span className="text-2xl mt-10 text-center">
              Great Vibe Events 2024 Spooktacular
            </span>
            <p className="pl-3 pr-3 text-lg text-[#5e5e5e] w-full lg:w-[800px] mt-4">
              The Halloween Costume Party of the Year! Show off your best
              costume and get ready for a night of spooky fun, fantastic
              festivities and an evening to meet new friends! When: Saturday
              October 12th Time: 4:00pm to 7:00pm Where: Unity of Fairfax, 2854
              Hunter Mill Road, Oakton, VA 22124.
            </p>
          </>
        )}
        <EventTicket priceList={sortedPrices} productId={params.id} />
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
