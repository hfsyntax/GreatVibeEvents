"use client"
import type { Stripe } from "stripe"
import type { MouseEvent } from "react"
import { getPriceDifference } from "@/lib/utils"
import { Open_Sans, Playfair_Display } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faX,
  faRightLong,
  faCaretDown,
  faCaretUp,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
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
}

type ProductProps = {
  items: Product[]
  prices: { [key: string]: Stripe.Price[] }
}

export default function Products({ items, prices }: ProductProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const search = params.get("search")
  const productType = params.get("type")
  const sort = params.get("sort")
  const [products, setProducts] = useState(items)
  const [loading, setLoading] = useState(true)
  const [productView, setProductView] = useState<boolean>(false)
  const [productViewImage, setProductViewImage] = useState("first")
  const [product, setProduct] = useState<Product | null>(null)
  const [showSorts, setShowSorts] = useState(false)
  const showQuickView = (
    event: MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation()
    event.preventDefault()
    setProductView(true)
    setProduct(product)
  }

  const closeQuickView = () => {
    if (productView) setProductView(false)
  }

  const toggleSorts = () => setShowSorts(!showSorts)

  const nextProductViewImage = () => {
    const nextImage = productViewImage === "first" ? "second" : "first"
    setProductViewImage(nextImage)
  }

  const sortDescriptions = {
    newest: "Newest",
    az: "Name (A-Z)",
    za: "Name (Z-A)",
    lh: "Price (low-high)",
    hl: "Price (high-low)",
  }

  const setSortParams = (key: string) => {
    const urlParams = new URLSearchParams(params)
    if (urlParams.get("sort") !== key) {
      urlParams.set("sort", key)
      toggleSorts()
      router.push(`${pathname}?${urlParams.toString()}`)
    }
  }

  useEffect(() => {
    let updatedItems = [...items]
    updatedItems = updatedItems.filter((product) =>
      productType
        ? product.metadata.type === productType
        : !product.metadata.type || product.metadata.type !== "Event Ticket"
    )
    updatedItems = updatedItems.sort((a, b) => {
      switch (sort) {
        case "az":
          return a.name.localeCompare(b.name)
        case "za":
          return b.name.localeCompare(a.name)
        case "lh":
          return (
            (prices[a.id][0].unit_amount || 0) -
            (prices[b.id][0].unit_amount || 0)
          )
        case "hl":
          return (
            (prices[b.id][0].unit_amount || 0) -
            (prices[a.id][0].unit_amount || 0)
          )
        default:
          return (
            new Date(b.created || 0).getTime() -
            new Date(a.created || 0).getTime()
          )
      }
    })
    if (search) {
      updatedItems = updatedItems.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (showSorts) toggleSorts()
    setProducts(updatedItems)
    setLoading(false)
  }, [params])

  if (loading) {
    return <span>Loading...</span>
  }

  return (
    <div className="flex flex-col">
      <div
        className={`backdrop-blur fixed top-0 left-0 w-full h-full z-10 hidden ${productView && "lg:block hide-scroll"}`}
      >
        <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[900px] h-[500px] xl:w-[1000px] xl:h-[500px] bg-white z-10 shadow flex">
          {product && product.images.length > 0 && (
            <div className="w-1/2 relative">
              {product.metadata?.second_image_url && (
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
                    ? product.images[0]
                    : product.metadata?.second_image_url
                )}
                alt="company_team"
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                className="w-full h-auto mr-auto ml-auto object-contain"
                priority
              />
              {product.metadata.second_image_url && (
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
            <FontAwesomeIcon
              icon={faX}
              size={`xl`}
              className="ml-auto mr-3 mt-3 cursor-pointer z-10"
              onClick={closeQuickView}
            />
            <span className="text-black text-4xl pl-6">{product?.name}</span>
            {product && prices[product.id]?.length >= 1 && (
              <>
                <div>
                  {product?.metadata.original_price && (
                    <span
                      className={`text-2xl ${openSans.className} line-through text-[#474747B3] pl-6`}
                    >
                      ${product.metadata.original_price}
                    </span>
                  )}
                  <span className={`text-2xl ${openSans.className} pl-6`}>
                    $
                    {parseFloat(
                      String(Number(prices[product?.id]?.[0].unit_amount) / 100)
                    ).toFixed(2)}
                  </span>
                </div>
                {product.metadata.original_price &&
                  prices[product.id][0].unit_amount && (
                    <span
                      className={`pl-6 text-red-500 text-lg ${openSans.className}`}
                    >
                      You save&nbsp;$
                      {
                        getPriceDifference(
                          parseFloat(product.metadata.original_price),
                          prices[product.id][0].unit_amount! / 100
                        ).dollarAmount
                      }
                      &nbsp;(
                      {
                        getPriceDifference(
                          parseFloat(product.metadata.original_price),
                          prices[product.id][0].unit_amount! / 100
                        ).percent
                      }
                      %)
                    </span>
                  )}
                {product.metadata.shipping && (
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
                <div className="mt-8 pl-6">
                  <span
                    className={`${openSans.className} text-lg text-[#49740B]`}
                  >
                    View Full Details
                  </span>
                  <FontAwesomeIcon
                    icon={faRightLong}
                    size="1x"
                    className="text-[#49740B] ml-1"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex ${openSans.className} mt-10 ml-3 xl:ml-0 text-center sm:text-left">
        <span className={` text-2xl `}>
          {products.length >= 1
            ? productType
              ? `${productType.charAt(0).toUpperCase()}${productType.slice(1)}`
              : "All Products"
            : `0 results found for "${search}"`}
        </span>
      </div>
      <div className="flex flex-wrap justify-center md:justify-normal gap-2 mt-8 relative">
        {products.length > 0 && (
          <div
            className={`flex justify-end items-center absolute top-[-30px] left-0 ml-3 sm:ml-0 sm:mr-3 sm:top-[-64px] sm:right-0  ${products.length === 1 && "lg:top-[-30px] lg:left-0 lg:ml-3 xl:ml-0 lg:right-auto xl:left-auto xl:right-0 xl:top-[-64px]"} cursor-pointer select-none text-[#5e5e5e] hover:text-gray-800`}
            onClick={toggleSorts}
          >
            <span className={`${openSans.className} text-lg`}>
              {sortDescriptions[sort as keyof typeof sortDescriptions]
                ? sortDescriptions[sort as keyof typeof sortDescriptions]
                : "Newest"}
            </span>
            <FontAwesomeIcon
              icon={showSorts ? faCaretUp : faCaretDown}
              size="1x"
              className="ml-1"
            />
          </div>
        )}
        <div
          className={`${openSans.className} text-lg absolute top-0 left-0 sm:mr-3 sm:top-[-35px] sm:left-auto sm:right-0 flex-col ${products.length === 1 && "lg:top-0"} pl-8 pr-8 pt-7 pb-7 border border-gray-200 w-[250px] h-fit ${showSorts ? "flex" : "hidden"} select-none z-10 bg-white`}
        >
          <span
            className={`pb-2 cursor-pointer w-fit hover:text-[#49740B] ${(sort === "newest" || !sort) && "text-[#49740B]"}`}
            onClick={() => setSortParams("newest")}
          >
            Newest
          </span>
          <span
            className={`pb-2 cursor-pointer w-fit hover:text-[#49740B] ${sort === "az" && "text-[#49740B]"}`}
            onClick={() => setSortParams("az")}
          >
            Name (A-Z)
          </span>
          <span
            className={`pb-2 cursor-pointer w-fit hover:text-[#49740B] ${sort === "za" && "text-[#49740B]"}`}
            onClick={() => setSortParams("za")}
          >
            Name (Z-A)
          </span>
          <span
            className={`pb-2 cursor-pointer w-fit hover:text-[#49740B] ${sort === "lh" && "text-[#49740B]"}`}
            onClick={() => setSortParams("lh")}
          >
            Price (low-high)
          </span>
          <span
            className={`cursor-pointer w-fit hover:text-[#49740B] ${sort === "hl" && "text-[#49740B]"}`}
            onClick={() => setSortParams("hl")}
          >
            Price (high-low)
          </span>
        </div>
        {products.map((product, index) => {
          const itemPrices = prices[product.id] || []
          return (
            <Link
              href={`/shop/products/${product.id}`}
              key={`shop_item_${index}`}
            >
              <div
                className={` flex flex-col w-full ${openSans.className} lg:w-[200px] xl:w-[300px]`}
              >
                <div className="flex flex-col relative group">
                  {product.metadata.original_price && (
                    <span className="ml-auto absolute top-0 right-0 text-xs lg:text-sm  pt-1 pb-1 pl-4 pr-4 lg:pt-2 lg:pb-2 lg:pl-6 lg:pr-6 bg-[#49740B] text-white">
                      sale
                    </span>
                  )}
                  <button
                    className={`absolute hidden bottom-0 left-0 bg-white text-black z-10 shadow-md w-full h-[30px] xl:h-[50px] ${!productView && "group-hover:lg:block"}`}
                    onClick={(e) => showQuickView(e, product)}
                  >
                    Quick view
                  </button>
                  <Image
                    src={`${product.images[0]}`}
                    alt={`${product.name}`}
                    width={0}
                    height={0}
                    sizes="(max-width: 1023px) 100%, (min-width: 1024px) 200px, (min-width: 1280px) 300px"
                    className="w-[100px] h-[100px] lg:w-[200px] lg:h-[200px] xl:w-[300px] xl:h-[300px] mr-auto ml-auto object-contain"
                    priority
                  />
                </div>
                {product.metadata.shipping && (
                  <span className="text-sm text-[#575757]">FREE SHIPPING</span>
                )}
                <span className="text-lg">{product.name}</span>
                {itemPrices.length > 1 ? (
                  <>
                    <span>
                      From $
                      {parseFloat(
                        String(Number(itemPrices[0].unit_amount) / 100)
                      ).toFixed(2)}
                    </span>
                    {product.metadata.original_price && (
                      <span>{product.metadata.original_price}</span>
                    )}
                    <span className="text-[#595959] text-sm mt-4">
                      More options
                    </span>
                  </>
                ) : (
                  <div>
                    {product.metadata.original_price && (
                      <span className="line-through text-[#474747B3]">
                        ${product.metadata.original_price}
                      </span>
                    )}
                    <span
                      className={`text-base ${product.metadata.original_price && "ml-3"}`}
                    >
                      $
                      {parseFloat(
                        String(Number(itemPrices[0].unit_amount) / 100)
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
