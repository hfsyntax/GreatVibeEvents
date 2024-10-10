"use client"
import type { Stripe } from "stripe"
import type { ChangeEvent } from "react"
import type { CheckoutData, Session } from "@/types"
import { storeCheckoutData, encryptEventTicket } from "@/lib/session"
import { getPriceOfPercentage } from "@/lib/utils"
import { Open_Sans } from "next/font/google"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

const openSans = Open_Sans({ subsets: ["latin"] })

export default function EventTicket({
  priceList,
  productId,
  session,
  checkoutData,
}: {
  priceList: Stripe.Price[]
  productId: string
  session: Session | null
  checkoutData: CheckoutData | null
}) {
  const { setData } = useCheckoutDataContext()
  const [message, setMessage] = useState<{ error: string; message: string }>({
    error: "",
    message: "",
  })
  const [priceId, setPriceId] = useState<string>(priceList[0].id)
  const [label, setLabel] = useState({ name: "tip0", amount: 0 })
  const customTipElement = useRef<HTMLInputElement | null>(null)
  const [customTip, setCustomTip] = useState<string>("$0.00")
  const router = useRouter()
  const selectedPrice = priceList.find((price) => price.id === priceId)
  const formattedAmount = selectedPrice?.unit_amount
    ? selectedPrice.unit_amount / 100
    : 0
  const totalBeforeTip = parseFloat(String(formattedAmount)).toFixed(2)
  const totalAfterTip =
    label.name === "tip4"
      ? parseFloat(
          String(formattedAmount + Number(customTip.slice(1))),
        ).toFixed(2)
      : parseFloat(String(formattedAmount + label.amount)).toFixed(2)

  const handleTicketChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (label.name !== "tip0") setLabel({ name: "tip0", amount: 0 }) // reset back to no tip
    setPriceId(event.target.value)
  }

  const handleTipClick = (tipName: string, tipPercentage: number) => {
    if (customTip !== "$0.00") setCustomTip("$0.00")
    setLabel({
      name: tipName,
      amount: getPriceOfPercentage(formattedAmount, tipPercentage),
    })
  }

  const handleCustomTipBlur = () => {
    const validPrice = /^\d{1,8}(\.\d{1,4})?$/
    if (!customTip?.match(validPrice)) {
      setCustomTip("$0.00")
    } else {
      setCustomTip(`$${parseFloat(customTip).toFixed(2)}`)
    }
  }

  const handleCustomTipChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomTip(event.target.value)
  }

  const goToCheckout = async () => {
    customTipElement.current?.blur()
    const tip =
      label.name === "tip4"
        ? Number(customTip.slice(1)) * 100
        : label.amount * 100
    const eventTicket: CheckoutData = {
      products: [
        {
          priceId: String(selectedPrice?.id),
          quantity: 1,
          metadata: { type: "Event Ticket", productId: productId },
          tip: tip,
        },
      ],
    }
    if (!session) {
      const encryptedTicket = await encryptEventTicket(eventTicket)
      router.push(`/checkout?eventTicket=${encryptedTicket}`)
    } else {
      if (checkoutData) {
        const eventTicketIndex = checkoutData.products.findIndex(
          (product) => product.priceId === selectedPrice?.id,
        )
        if (eventTicketIndex !== -1) {
          return setMessage({
            error: "Product is already in your cart",
            message: "",
          })
        }
        const updatedProducts = [
          ...checkoutData.products,
          eventTicket.products[0],
        ]
        const updatedCheckoutData: CheckoutData = {
          ...checkoutData,
          products: updatedProducts,
        }
        if (eventTicket.products[0].tip) {
          updatedCheckoutData.tip = updatedCheckoutData.tip
            ? updatedCheckoutData.tip + eventTicket.products[0].tip
            : eventTicket.products[0].tip
        }
        await storeCheckoutData(updatedCheckoutData)
        setData((prevData) => ({
          ...prevData,
          totalProducts: updatedCheckoutData.products.length,
        }))
        router.push(`/checkout`)
      }
    }
  }

  const addToCart = async () => {
    customTipElement.current?.blur()
    const tip =
      label.name === "tip4"
        ? Number(customTip.slice(1)) * 100
        : label.amount * 100
    const eventTicket: CheckoutData = {
      products: [
        {
          priceId: String(selectedPrice?.id),
          quantity: 1,
          metadata: { type: "Event Ticket", productId: productId },
          tip: tip,
        },
      ],
    }
    if (!session) {
      const encryptedTicket = await encryptEventTicket(eventTicket)
      router.push(`/checkout?eventTicket=${encryptedTicket}`)
    } else {
      if (checkoutData) {
        const eventTicketIndex =
          checkoutData.products.length > 0
            ? checkoutData.products.findIndex(
                (product) => product.priceId === selectedPrice?.id,
              )
            : -1
        if (eventTicketIndex !== -1) {
          return setMessage({
            message: "",
            error: "Product is already in your cart",
          })
        }
        const updatedProducts = [
          ...checkoutData.products,
          eventTicket.products[0],
        ]
        const updatedCheckoutData: CheckoutData = {
          ...checkoutData,
          products: updatedProducts,
        }

        if (eventTicket.products[0].tip) {
          updatedCheckoutData.tip = updatedCheckoutData.tip
            ? eventTicket.products[0].tip + updatedCheckoutData.tip
            : eventTicket.products[0].tip
        }
        await storeCheckoutData(updatedCheckoutData)
        setData((prevData) => ({
          ...prevData,
          totalProducts: updatedCheckoutData.products.length,
        }))
        if (!message.message) setMessage({ error: "", message: "Success" })
      }
    }
  }

  return (
    <div className="mt-3 flex flex-col">
      {priceList.map((price, index) => (
        <div key={`ticket_${index}`} className="pl-3 md:pl-0">
          <input
            type="radio"
            name="choice"
            value={price.id}
            checked={price.id === priceId}
            onChange={handleTicketChange}
          />
          <label className="ml-3 text-lg">
            {price.nickname === "Participant Ticket"
              ? `1 Participant (includes meal) : $${(parseFloat(String(price.unit_amount)) / 100).toFixed(2)}`
              : price.nickname ===
                  "Participant and Caretaker/Parent Meal Ticket"
                ? `1 Participant and 1 caretacker/parent (includes caretaker/parent meal): $${(parseFloat(String(price.unit_amount)) / 100).toFixed(2)}`
                : price.nickname ===
                    "2 Participants and Caretaker/Parent Meal Ticket"
                  ? `2 Participants and 1 caretaker/parent (includes caretaker/parent meal) : $${(parseFloat(String(price.unit_amount)) / 100).toFixed(2)}`
                  : price.nickname ===
                      "1 Participant and 2 Caretakers/Parents Meal Ticket"
                    ? `1 Participant and 2 caretaker/parents (includes caretaker/parent meal) $${(parseFloat(String(price.unit_amount)) / 100).toFixed(2)}`
                    : `${price.nickname} $${(parseFloat(String(price.unit_amount)) / 100).toFixed(2)}`}
          </label>
        </div>
      ))}
      <span className="mt-5 pl-3 text-lg md:pl-0">Add a Tip:</span>
      <div className="flex flex-wrap justify-between pl-3 pr-3 md:gap-3 md:pl-0 md:pr-0">
        <button
          className={`${label.name === "tip1" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={() => handleTipClick("tip1", 15)}
          type="button"
        >
          15%
          <br />
          <span className="text-xs">
            $
            {parseFloat(
              String(getPriceOfPercentage(formattedAmount, 15)),
            ).toFixed(2)}
          </span>
        </button>
        <button
          className={`${label.name === "tip2" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={() => handleTipClick("tip2", 18)}
          type="button"
        >
          18%
          <br />
          <span className="text-xs">
            $
            {parseFloat(
              String(getPriceOfPercentage(formattedAmount, 18)),
            ).toFixed(2)}
          </span>
        </button>
        <button
          className={`${label.name === "tip3" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={() => handleTipClick("tip3", 20)}
          type="button"
        >
          20%
          <br />
          <span className="text-xs">
            $
            {parseFloat(
              String(getPriceOfPercentage(formattedAmount, 20)),
            ).toFixed(2)}
          </span>
        </button>
        <button
          className={`${label.name === "tip0" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={() => handleTipClick("tip0", 0)}
          type="button"
        >
          No Tip
        </button>
        <button
          className={`${label.name === "tip4" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={(event) => handleTipClick("tip4", 0)}
          type="button"
        >
          Custom Tip
        </button>
      </div>
      {label.name === "tip4" && (
        <input
          type="text"
          name="custom-tip"
          value={customTip}
          onFocus={() => setCustomTip("")}
          onBlur={handleCustomTipBlur}
          onChange={handleCustomTipChange}
          className="mt-3 box-border h-[50px] border-[1px] border-gray-200 pl-3 outline-none focus:border-black"
          ref={customTipElement}
          required
        />
      )}
      <div className="flex pl-3 pr-3 pt-10 md:pl-0 md:pr-0">
        <span>Total before tip</span>
        <span className="ml-auto">${totalBeforeTip}</span>
      </div>
      <div className="flex pl-3 pr-3 md:pl-0 md:pr-0">
        <span>Tip</span>
        <span className="ml-auto">
          $
          {label.name === "tip4"
            ? customTip.slice(1)
            : parseFloat(String(label.amount)).toFixed(2)}
        </span>
      </div>
      <hr className="mt-3" />
      <div className="flex pl-3 pr-3 pt-5 md:pl-0 md:pr-0">
        <b>Total</b>
        <b className="ml-auto">{totalAfterTip}</b>
      </div>
      <div className="mt-5 flex w-full justify-center gap-7">
        <button
          className={`h-[60px] w-[30%] bg-[#49740B] text-center leading-[60px] text-white sm:w-[170px] ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
          onClick={goToCheckout}
          type="button"
        >
          B U Y &nbsp;N O W
        </button>
        <button
          className={`h-[60px] w-[50%] bg-[#49740B] text-center leading-[60px] text-white sm:w-[200px] ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
          onClick={addToCart}
          type="button"
        >
          A D D &nbsp;T O &nbsp;C A R T
        </button>
      </div>
      {message.error && (
        <span className={`${openSans.className} pl-6 pt-2 text-red-500`}>
          {message.error}
        </span>
      )}
      {message.message && (
        <span className={`${openSans.className} pl-6 pt-2 text-green-500`}>
          {message.message}
        </span>
      )}
    </div>
  )
}
