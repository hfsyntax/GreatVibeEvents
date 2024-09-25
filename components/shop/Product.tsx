"use client"
import type { MouseEvent, TouchEvent } from "react"
import type { ProductVariant } from "@/actions/server"
import { getPriceDifference } from "@/lib/utils"
import { Open_Sans, Playfair_Display } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import Link from "next/link"
import Image from "next/image"
import { CheckoutData, storeCheckoutData } from "@/lib/session"

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
  variants: Array<ProductVariant>
}

export default function Product({ item, prices, variants }: ProductProps) {
  const [url, setUrl] = useState<string | undefined>()
  const router = useRouter()
  const { data, setData } = useCheckoutDataContext()
  const [productVariant, setProductVariant] = useState<ProductVariant>({
    name: item.name,
    image_url: data.variant?.image_url
      ? data.variant.image_url
      : item.images[0],
  })
  const [imageTransform, setImageTransform] = useState("none")

  const calculateTransform = (
    clientX: number,
    clientY: number,
    imageContainer: HTMLDivElement,
  ) => {
    const { left, top } = imageContainer.getBoundingClientRect()
    const containerWidth = imageContainer.clientWidth
    const containerHeight = imageContainer.clientHeight
    const x = clientX - left
    const y = clientY - top
    const scale = 2
    const scaledWidth = containerWidth * scale
    const scaledHeight = containerHeight * scale
    const offsetX = Math.max(
      0,
      Math.min(x * scale - containerWidth / 2, scaledWidth - containerWidth),
    )
    const offsetY = Math.max(
      0,
      Math.min(y * scale - containerHeight / 2, scaledHeight - containerHeight),
    )
    setImageTransform(`translate(-${offsetX}px, -${offsetY}px) scale(${scale})`)
  }

  const mouseOverImage = useCallback((event: MouseEvent<HTMLDivElement>) => {
    calculateTransform(event.clientX, event.clientY, event.currentTarget)
  }, [])

  const touchOverImage = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    calculateTransform(touch.clientX, touch.clientY, event.currentTarget)
  }, [])

  const imageLeave = useCallback(() => {
    setImageTransform("none")
  }, [])

  useEffect(() => {
    if (typeof window !== undefined) {
      setUrl(window.location.href)
    }
  }, [])

  return (
    <div className="mt-10 flex flex-col">
      <Link href={"/shop"} className="ml-5 w-fit text-[#49740B] xl:ml-0">
        <FontAwesomeIcon icon={faCaretLeft} size="xl" className="mr-auto" />
        <span className={`${openSans.className} ml-2 text-lg`}>
          All Products
        </span>
      </Link>
      <div className="mt-10 flex h-fit w-full flex-col md:flex-row">
        {item && item.images.length > 0 && (
          <div className="relative w-full flex-col overflow-hidden md:w-1/2">
            <div
              className={`relative ml-auto mr-auto h-[400px] w-full overflow-hidden hover:cursor-crosshair md:h-[500px] ${imageTransform !== "none" && "hide-scroll"}`}
              onMouseMove={mouseOverImage}
              onMouseLeave={imageLeave}
              onTouchMove={touchOverImage}
              onTouchEnd={imageLeave}
            >
              <Image
                src={productVariant.image_url}
                alt={`product_${productVariant.name}`}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                className={`h-full w-full object-contain ${imageTransform !== "none" && "origin-top-left"}`}
                style={{
                  transform: imageTransform,
                }}
                priority
              />
            </div>

            {item.metadata?.variants && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {variants.map((variant, index) => (
                  <div
                    className={`h-[50px] w-[50px] border ${productVariant.image_url === variant.image_url && "border-black"} cursor-pointer bg-transparent`}
                    onClick={() =>
                      setProductVariant({
                        name: variant.name,
                        image_url: variant.image_url,
                      })
                    }
                    key={`${item.name}_variant_${index}`}
                  >
                    <Image
                      src={String(variant.image_url)}
                      alt={`variant_${variant.name}`}
                      width={50}
                      height={50}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div
          className={`flex w-full flex-col md:w-1/2 ${playfairDisplay.className} md:h-[500px]`}
        >
          <span className="mt-5 text-center text-4xl text-black md:mt-0 md:pl-6 md:text-left">
            {item?.name}
          </span>
          {item && prices.length >= 1 && (
            <>
              <div className="text-center md:text-left">
                {item?.metadata.original_price && (
                  <span
                    className={`text-2xl ${openSans.className} pl-6 text-[#474747B3] line-through`}
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
                  className={`pl-6 text-lg text-red-500 ${openSans.className}`}
                >
                  You save&nbsp;$
                  {
                    getPriceDifference(
                      parseFloat(item.metadata.original_price),
                      prices[0] / 100,
                    ).dollarAmount
                  }
                  &nbsp;(
                  {
                    getPriceDifference(
                      parseFloat(item.metadata.original_price),
                      prices[0] / 100,
                    ).percent
                  }
                  %)
                </span>
              )}
              {item.metadata.shipping && (
                <span
                  className={`mt-4 pl-6 text-sm text-[#575757] ${openSans.className}`}
                >
                  FREE SHIPPING
                </span>
              )}
              <label className={`${openSans.className} mt-10 pl-6 text-lg`}>
                Quantity
              </label>
              <input
                type="number"
                defaultValue={1}
                className={`w-fit pb-4 pl-2 pr-2 pt-4 ${openSans.className} ml-6 h-[60px] w-[130px] border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent`}
              />
              <div className="mt-5 flex w-full flex-col md:flex-row md:gap-7 md:pl-6">
                <button
                  className={`ml-6 mr-6 h-[60px] bg-[#49740B] text-center leading-[60px] text-white md:ml-0 md:mr-0 md:w-[170px] ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
                >
                  B U Y &nbsp;N O W
                </button>
                <Link
                  href={"#"}
                  className={`ml-6 mr-6 h-[60px] bg-[#49740B] text-center leading-[60px] text-white md:ml-0 md:mr-0 md:w-[200px] ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
                >
                  A D D &nbsp;T O &nbsp;C A R T
                </Link>
              </div>
              <div
                className={`flex ${openSans.className} mt-5 items-center gap-2 pl-6`}
              >
                <span className="text-lg">Share</span>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </Link>
                <Link
                  href={`https://x.com/intent/post?text=${url}`}
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faXTwitter} size="lg" />
                </Link>
              </div>
              <span
                className={`${openSans.className} mt-3 pl-6 pr-6 text-base text-[#5e5e5e] md:pr-0`}
              >
                {item.description}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
