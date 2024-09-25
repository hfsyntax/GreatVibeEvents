"use client"
import type { Stripe } from "stripe"
import type { ChangeEvent } from "react"
import { storeCheckoutData } from "@/lib/session"
import { convertToSubcurrency, getPriceOfPercentage } from "@/lib/utils"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
export default function EventTicket({
  priceList,
  productId,
}: {
  priceList: Stripe.Price[]
  productId: string
}) {
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
    let amount = parseFloat(totalAfterTip)
    customTipElement.current?.blur()
    if (isNaN(amount)) return
    amount = convertToSubcurrency(amount)
    const data = {
      amount: amount,
      priceId: String(selectedPrice?.id),
      productId: productId,
      variantName: null,
    }
    await storeCheckoutData(data)
    router.push(`/checkout?product_id=${productId}`)
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
        >
          No Tip
        </button>
        <button
          className={`${label.name === "tip4" ? "bg-[#d8efef] text-[#09757a]" : "bg-[#F5F7F8]"} mt-3 pb-2 pl-4 pr-4 pt-2 sm:flex-1`}
          onClick={(event) => handleTipClick("tip4", 0)}
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
      <button className="mt-3 bg-black p-3 text-white" onClick={goToCheckout}>
        Proceed to Checkout
      </button>
    </div>
  )
}
