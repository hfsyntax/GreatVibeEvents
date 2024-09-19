"use client"
import type { Stripe } from "stripe"
import { getPriceDifference } from "@/lib/utils"
import { Open_Sans, Playfair_Display } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRightLong,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
const openSans = Open_Sans({ subsets: ["latin"] })
const playfairDisplay = Playfair_Display({ subsets: ["latin"] })

type Product = {
  id: string
  name: string
  metadata: { [key: string]: string }
  images: string[]
  created: number
  description: string | null
}

type ProductProps = {
  item: Product
  prices: Array<number | null>
}

export default function Product({ item, prices }: ProductProps) {
  const [productViewImage, setProductViewImage] = useState("first")

  const nextProductViewImage = () => {
    const nextImage = productViewImage === "first" ? "second" : "first"
    setProductViewImage(nextImage)
  }

  return (
    <div className="flex flex-col mt-10">
      <Link href={"/shop"} className="text-[#49740B] w-fit">
        <FontAwesomeIcon icon={faCaretLeft} size="xl" className="mr-auto" />
        <span className={`${openSans.className} text-lg ml-2`}>
          All Products
        </span>
      </Link>
      <div className="w-full h-[500px] flex">
        {item && item.images.length > 0 && (
          <div className="w-1/2 relative">
            {item.metadata?.second_image_url && (
              <FontAwesomeIcon
                icon={faCaretLeft}
                size="2xl"
                className="absolute top-1/2 left-0 ml-3 translate-y-[-50%] !text-5xl cursor-pointer select-none"
                onClick={nextProductViewImage}
              />
            )}
            <Image
              src={String(
                productViewImage === "first"
                  ? item.images[0]
                  : item.metadata?.second_image_url
              )}
              alt={`quickview_${item.name}`}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              className="w-full h-full mr-auto ml-auto object-contain"
              priority
            />
            {item.metadata.second_image_url && (
              <FontAwesomeIcon
                icon={faCaretRight}
                size="2xl"
                className="absolute top-1/2 right-0 mr-3 translate-y-[-50%] !text-5xl cursor-pointer select-none"
                onClick={nextProductViewImage}
              />
            )}
          </div>
        )}
        <div className={`w-1/2 flex flex-col ${playfairDisplay.className}`}>
          <span className="text-black text-4xl pl-6">{item?.name}</span>
          {item && prices.length >= 1 && (
            <>
              <div>
                {item?.metadata.original_price && (
                  <span
                    className={`text-2xl ${openSans.className} line-through text-[#474747B3] pl-6`}
                  >
                    ${item.metadata.original_price}
                  </span>
                )}
                <span className={`text-2xl ${openSans.className} pl-6`}>
                  ${parseFloat(String(Number(prices?.[0]) / 100)).toFixed(2)}
                </span>
              </div>
              {item.metadata.original_price && prices[0] && (
                <span
                  className={`pl-6 text-red-500 text-lg ${openSans.className}`}
                >
                  You save&nbsp;$
                  {
                    getPriceDifference(
                      parseFloat(item.metadata.original_price),
                      prices[0] / 100
                    ).dollarAmount
                  }
                  &nbsp;(
                  {
                    getPriceDifference(
                      parseFloat(item.metadata.original_price),
                      prices[0] / 100
                    ).percent
                  }
                  %)
                </span>
              )}
              {item.metadata.shipping && (
                <span
                  className={`text-sm mt-4 pl-6 text-[#575757] ${openSans.className}`}
                >
                  FREE SHIPPING
                </span>
              )}
              <label className={`${openSans.className} text-lg pl-6 mt-10`}>
                Quantity
              </label>
              <input
                type="number"
                defaultValue={1}
                className={`w-fit pl-2 pr-2 pt-4 pb-4 ${openSans.className} ml-6 border w-[130px] h-[60px] border-b-gray-200 border-t-transparent border-l-transparent border-r-transparent`}
              />
              <div className="w-full flex gap-7 pl-6">
                <Link
                  href={"#"}
                  className={`bg-[#49740B] text-white w-[170px] h-[60px] text-center leading-[60px] ${openSans.className} text-base font-bold mt-3`}
                >
                  B U Y &nbsp;N O W
                </Link>
                <Link
                  href={"#"}
                  className={`bg-[#49740B] text-white w-[200px] h-[60px] text-center leading-[60px] ${openSans.className} text-base font-bold mt-3`}
                >
                  A D D &nbsp;T O &nbsp;C A R T
                </Link>
              </div>
              <span className={`${openSans.className} text-lg mt-3`}>
                {item.description}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
