"use client"
import type { CartItem } from "@/types"
import type { ChangeEvent } from "react"
import { getCheckoutData, storeCheckoutData } from "@/lib/session"
import { Open_Sans } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useState, Fragment } from "react"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { useRouter } from "next/navigation"
import Image from "next/image"

const openSans = Open_Sans({ subsets: ["latin"] })

export default function Cart({ products }: { products: CartItem }) {
  const [items, setItems] = useState<CartItem>(products)
  const { setData } = useCheckoutDataContext()
  const router = useRouter()
  const totalItems = Object.keys(items).length
  const total = (
    Object.values(items).reduce((accumulator, item) => {
      return accumulator + (item.stripeProduct?.amount ?? 0) * item.quantity
    }, 0) / 100
  ).toFixed(2)

  const removeItem = async (priceId: string) => {
    const updatedItems = { ...items }
    delete updatedItems[priceId]
    const checkoutData = await getCheckoutData()
    const updatedCheckoutData = {
      ...checkoutData,
      products: checkoutData.products.filter(
        (product) => product.priceId !== priceId,
      ),
    }
    await storeCheckoutData(updatedCheckoutData)
    setData((prevData) => ({
      ...prevData,
      totalProducts: prevData.totalProducts - 1,
    }))
    setItems(updatedItems)
  }

  const updateItemQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    priceId: string,
  ) => {
    const quantity = parseInt(e.target.value)
    if (isNaN(quantity) || quantity < 1) return
    setItems((prevItems) => ({
      ...prevItems,
      [priceId]: {
        ...prevItems[priceId],
        quantity: quantity,
      },
    }))
  }

  const goToCheckout = async () => {
    const checkoutData = await getCheckoutData()
    const updatedCheckoutData = {
      ...checkoutData,
      products: Object.entries(items).map(([priceId, item]) => ({
        priceId,
        quantity: item.quantity,
      })),
    }
    await storeCheckoutData(updatedCheckoutData)
    router.push("/checkout")
  }

  return (
    <div
      className={`relative mt-8 flex w-full flex-col gap-3 ${openSans.className}`}
    >
      <b className="mb-3 text-center text-xl md:text-2xl lg:text-3xl">
        Cart contains&nbsp;
        {totalItems === 1 ? `${totalItems} item` : `${totalItems} items`}.
      </b>
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-1 flex-col justify-center text-center sm:flex-row sm:gap-3 sm:text-left">
          <span className="w-full text-lg sm:ml-2 sm:w-[100px] lg:w-[200px] xl:ml-0 xl:w-[300px]">
            Item
          </span>
          <span className="hidden flex-1 text-lg sm:inline">Name</span>
        </div>

        <div className="flex w-[100px] flex-col sm:w-[200px] sm:flex-row">
          <span className="w-full text-left text-lg sm:w-1/2">Price</span>
          <span className="w-full text-left text-lg sm:w-1/2">Quantity</span>
        </div>
        <span className="w-[105px] text-left text-lg">Total</span>
      </div>
      <hr />
      {Object.entries(items).map(([priceId, { stripeProduct, quantity }]) => {
        return (
          stripeProduct &&
          stripeProduct.amount && (
            <Fragment key={`shop_item_${priceId}`}>
              <div className="flex w-full flex-row items-center justify-between gap-3">
                <div className="flex flex-1 flex-col items-center sm:flex-row sm:gap-3">
                  <Image
                    src={`${stripeProduct.product.images[0]}`}
                    alt={`${stripeProduct.product.name}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 1023px) 300px, (min-width: 1024px) 200px, (min-width: 1280px) 300px"
                    className="h-[100px] w-[100px] object-contain lg:h-[200px] lg:w-[200px] xl:h-[300px] xl:w-[300px]"
                    priority
                  />
                  <span className="flex-1 text-center text-lg sm:text-left">
                    {stripeProduct.product.name}
                  </span>
                </div>

                <div className="flex w-[100px] flex-col sm:w-[200px] sm:flex-row">
                  <span className="w-full text-left text-lg sm:w-1/2">
                    ${(stripeProduct.amount / 100).toFixed(2)}
                  </span>
                  <input
                    className="box-border w-full border text-left text-lg sm:w-1/2"
                    type="number"
                    value={quantity}
                    onChange={(e) => updateItemQuantity(e, priceId)}
                  />
                </div>

                <div className="w-[105px] text-left text-lg">
                  <span>
                    ${((quantity * stripeProduct.amount) / 100).toFixed(2)}
                  </span>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size="lg"
                    className="ml-2 mr-2 cursor-pointer"
                    onClick={() => removeItem(priceId)}
                  />
                </div>
              </div>
              <hr />
            </Fragment>
          )
        )
      })}
      <div className="ml-auto text-lg">
        <span>Total</span>
        <span className="ml-3 mr-3 xl:mr-0">${total}</span>
      </div>
      <button
        className="ml-auto mr-auto h-[50px] w-[80%] bg-[#49740B] text-white hover:bg-lime-600"
        onClick={goToCheckout}
      >
        Proceed to checkout
      </button>
    </div>
  )
}
