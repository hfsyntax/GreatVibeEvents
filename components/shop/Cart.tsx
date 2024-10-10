"use client"
import type { CartItem, CheckoutData, Session } from "@/types"
import type { ChangeEvent } from "react"
import { getCheckoutData, storeCheckoutData } from "@/lib/session"
import { Open_Sans } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useState, Fragment, useEffect } from "react"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getProductByPriceId } from "@/lib/stripe"

const openSans = Open_Sans({ subsets: ["latin"] })

export default function Cart({
  products,
  session,
}: {
  products: CartItem | null
  session: Session | null
}) {
  const [items, setItems] = useState<CartItem | null | undefined>(products)
  const { setData } = useCheckoutDataContext()
  const router = useRouter()
  const totalItems = items ? Object.keys(items).length : 0
  const totalTip = items
    ? Object.values(items).reduce((accumulator, item) => {
        return accumulator + (item.tip ?? 0)
      }, 0)
    : undefined
  const total = items
    ? (
        Object.values(items).reduce((accumulator, item) => {
          return accumulator + (item.amount ?? 0) * item.quantity
        }, 0) / 100
      ).toFixed(2)
    : 0

  const removeItem = async (priceId: string) => {
    const updatedItems = { ...items }
    if (updatedItems) {
      updatedItems[priceId] = { ...updatedItems[priceId] }
      const deletedTip = updatedItems?.[priceId].tip ?? 0
      delete updatedItems?.[priceId]
      const updatedTip = totalTip
        ? totalTip - deletedTip > 0
          ? totalTip - deletedTip
          : undefined
        : undefined
      const updatedCheckoutData: CheckoutData = {
        products: Object.entries(updatedItems).map(([priceId, item]) => ({
          priceId: priceId,
          quantity: item.quantity,
          tip: item.tip ?? 0,
          metadata: item.metadata,
        })),
        tip: updatedTip,
      }
      const encryptedCheckoutData = await storeCheckoutData(updatedCheckoutData)
      if (!session) {
        sessionStorage.setItem("shopData", encryptedCheckoutData)
      }
      setData((prevData) => ({
        ...prevData,
        totalProducts: prevData.totalProducts - 1,
      }))
      setItems({ ...updatedItems })
    }
  }

  const updateItemQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    priceId: string,
  ) => {
    const quantity = parseInt(e.target.value)
    if (isNaN(quantity) || quantity < 1) return
    setItems((prevItems) => {
      if (!prevItems) return prevItems
      return {
        ...prevItems,
        [priceId]: {
          ...prevItems[priceId],
          quantity: quantity,
        },
      }
    })
  }

  const goToCheckout = async () => {
    if (items) {
      const updatedCheckoutData: CheckoutData = {
        products: Object.entries(items).map(([priceId, item]) => ({
          priceId,
          quantity: item.quantity,
          tip: item.tip,
          metadata: item.metadata,
        })),
        tip: totalTip,
      }
      await storeCheckoutData(updatedCheckoutData)
      router.push("/checkout")
    }
  }

  useEffect(() => {
    if (items === null) {
      const guestItems = sessionStorage.getItem("shopData")
      if (guestItems) {
        getCheckoutData(guestItems).then((response) => {
          if (response) {
            let newItems: CartItem = {}
            Promise.all(
              response.products.map(async (product) => {
                const stripeProduct = await getProductByPriceId(product.priceId)
                if (stripeProduct) {
                  newItems[product.priceId] = {
                    product: stripeProduct.product,
                    amount: stripeProduct.amount,
                    quantity: product.quantity,
                    tip: product.tip ? product.tip : undefined,
                  }
                }
              }),
            ).then(() => setItems(newItems))
          } else {
            setItems(undefined)
          }
        })
      } else {
        setItems(undefined)
      }
    }
  }, [])

  if (items === null) {
    return <span>loading...</span>
  }

  if (items === undefined || (items && Object.keys(items).length === 0)) {
    return <span>Shopping cart is empty.</span>
  }

  return (
    items && (
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
        {items &&
          Object.entries(items).map(
            ([priceId, { product, quantity, amount }]) => {
              return (
                amount && (
                  <Fragment key={`shop_item_${priceId}`}>
                    <div className="flex w-full flex-row items-center justify-between gap-3">
                      <div className="flex flex-1 flex-col items-center sm:flex-row sm:gap-3">
                        <Image
                          src={`${product.images[0]}`}
                          alt={`${product.name}`}
                          width={0}
                          height={0}
                          sizes="(max-width: 1023px) 300px, (min-width: 1024px) 200px, (min-width: 1280px) 300px"
                          className="h-[100px] w-[100px] object-contain lg:h-[200px] lg:w-[200px] xl:h-[300px] xl:w-[300px]"
                          priority
                        />
                        <span className="flex-1 text-center text-lg sm:text-left">
                          {product.name}
                        </span>
                      </div>

                      <div className="flex w-[100px] flex-col sm:w-[200px] sm:flex-row">
                        <span className="w-full text-left text-lg sm:w-1/2">
                          ${(amount / 100).toFixed(2)}
                        </span>
                        <input
                          className="box-border w-full border text-left text-lg sm:w-1/2"
                          type="number"
                          value={quantity}
                          onChange={(e) => updateItemQuantity(e, priceId)}
                        />
                      </div>

                      <div className="w-[105px] text-left text-lg">
                        <span>${((quantity * amount) / 100).toFixed(2)}</span>

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
            },
          )}
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
  )
}
