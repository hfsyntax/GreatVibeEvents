"use client"
import type { Stripe } from "stripe"
import type { ChangeEvent, MouseEvent } from "react"
import type { Product } from "@/types"
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
import ProductList from "@/components/shop/ProductList"
import { getProductVariants } from "@/actions/server"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { storeCheckoutData } from "@/lib/session"
const openSans = Open_Sans({ subsets: ["latin"] })
const playfairDisplay = Playfair_Display({ subsets: ["latin"] })

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
  const productsWithoutVariants = items.filter(
    (item) => !item.metadata.productId,
  )
  const [products, setProducts] = useState(productsWithoutVariants)
  const [loading, setLoading] = useState(true)
  const [productView, setProductView] = useState<boolean>(false)
  const { data, setData } = useCheckoutDataContext()
  const [product, setProduct] = useState<{
    currentPrice: {
      id: string
      name: string
      amount: number | null
    }
    variants: Array<Product>
    currentVariant: null | Product
    currentVariantIndex: number
    quantity: number
  } | null>(null)
  const [showSorts, setShowSorts] = useState(false)

  const showQuickView = async (
    event: MouseEvent<HTMLButtonElement>,
    newProduct: Product,
  ) => {
    event.stopPropagation()
    event.preventDefault()
    if (!product) {
      let variants: Array<Product> = []
      variants.push(newProduct)
      if (newProduct.metadata.variants) {
        const otherVariants = await getProductVariants(newProduct.id)
        variants = variants.concat(otherVariants)
      }
      setProduct({
        variants: variants,
        currentVariant: variants[0],
        currentVariantIndex: 0,
        quantity: 1,
        currentPrice: {
          id: prices[newProduct.id][0].id,
          name: prices[newProduct.id][0].nickname ?? "default",
          amount: prices[newProduct.id][0].unit_amount,
        },
      })
      setData({
        product: newProduct,
        variants: variants,
        quantity: 1,
      })
    }
  }

  const closeQuickView = () => {
    if (productView) setProductView(false)
    if (product) setProduct(null)
  }

  const setPriceLabel = (event: ChangeEvent<HTMLSelectElement>) => {
    if (product?.currentVariant) {
      const selectedName = event.target.value
      const price = prices[product.currentVariant.id].find(
        (price) => price.nickname === selectedName,
      )
      if (price && product.currentPrice.id !== price.id) {
        setProduct({
          ...product,
          currentPrice: {
            id: price.id,
            name: price.nickname ? price.nickname : "default",
            amount: price.unit_amount,
          },
        })
      }
    }
  }

  const goToCheckout = async () => {
    if (
      product &&
      product.currentPrice.amount &&
      product.quantity &&
      product.currentVariant
    ) {
      const shopData = {
        priceId: product.currentPrice.id,
        quantity: product.quantity,
      }
      await storeCheckoutData(shopData)
      router.push(`/checkout?product_id=${product.currentVariant.id}`)
    }
  }

  const toggleSorts = () => setShowSorts(!showSorts)

  const nextProductViewVariant = () => {
    if (product && product.variants.length > 0) {
      const nextVariantIndex =
        (product.currentVariantIndex + 1) % product.variants.length
      if (nextVariantIndex < product.variants.length) {
        setProduct({
          ...product,
          currentVariantIndex: nextVariantIndex,
          currentVariant: product.variants[nextVariantIndex],
          quantity: 1,
          currentPrice: {
            id: prices[product.variants[nextVariantIndex].id][0].id,
            name:
              prices[product.variants[nextVariantIndex].id][0].nickname ??
              "default",
            amount:
              prices[product.variants[nextVariantIndex].id][0].unit_amount,
          },
        })
        setData({
          ...data,
          product: product.variants[nextVariantIndex],
          quantity: 1,
        })
      }
    }
  }

  const previousProductViewVariant = () => {
    if (product && product.variants.length > 0) {
      const previousVariantIndex =
        (product.currentVariantIndex - 1 + product.variants.length) %
        product.variants.length
      if (previousVariantIndex < product.variants.length) {
        setProduct({
          ...product,
          currentVariantIndex: previousVariantIndex,
          currentVariant: product.variants[previousVariantIndex],
          quantity: 1,
          currentPrice: {
            id: prices[product.variants[previousVariantIndex].id][0].id,
            name:
              prices[product.variants[previousVariantIndex].id][0].nickname ??
              "default",
            amount:
              prices[product.variants[previousVariantIndex].id][0].unit_amount,
          },
        })
        setData({
          ...data,
          product: product.variants[previousVariantIndex],
          quantity: 1,
        })
      }
    }
  }

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (product && Number.isInteger(parseFloat(value))) {
      setProduct({ ...product, quantity: Number(value) })
      setData({ ...data, quantity: Number(value) })
    }
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
    let updatedItems = [...productsWithoutVariants]

    if (productType) {
      updatedItems = updatedItems.filter(
        (product) => product.metadata.type === productType,
      )
    }

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
        product.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (showSorts) toggleSorts()

    setProducts(updatedItems)
    setLoading(false)
  }, [params])

  useEffect(() => {
    if (product) {
      setProductView(true)
    }
  }, [product])

  useEffect(() => {
    // clear previously set checkout context
    if (data) {
      setData({ product: null, variants: null, quantity: null })
    }
  }, [])

  if (loading) {
    return <span>Loading...</span>
  }

  return (
    <div className="flex w-full flex-col">
      <div
        className={`fixed left-0 top-0 z-10 hidden h-full w-full backdrop-blur ${productView && "hide-scroll lg:block"}`}
      >
        <div className="absolute left-1/2 top-1/2 z-10 flex w-[900px] translate-x-[-50%] translate-y-[-50%] bg-white shadow xl:w-[1000px]">
          {product &&
            product.currentVariant &&
            product.currentVariant.images.length > 0 && (
              <div className="relative w-1/2">
                {product.variants[0].metadata?.variants && (
                  <FontAwesomeIcon
                    icon={faCaretLeft}
                    size="2xl"
                    className="absolute left-0 top-1/2 ml-3 translate-y-[-50%] cursor-pointer select-none !text-5xl"
                    onClick={previousProductViewVariant}
                  />
                )}
                <Image
                  src={String(product.currentVariant.images[0])}
                  alt={`quickview_${product.currentVariant.name}`}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                  className="ml-auto mr-auto h-[500px] w-full object-contain"
                  priority
                />
                {product.variants[0].metadata.variants && (
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    size="2xl"
                    className="absolute right-0 top-1/2 mr-3 translate-y-[-50%] cursor-pointer select-none !text-5xl"
                    onClick={nextProductViewVariant}
                  />
                )}
              </div>
            )}
          <div className={`flex w-1/2 flex-col ${playfairDisplay.className}`}>
            <FontAwesomeIcon
              icon={faX}
              size={`xl`}
              className="z-10 ml-auto mr-3 mt-3 cursor-pointer"
              onClick={closeQuickView}
            />
            <span className="pl-6 text-4xl text-black">
              {product?.currentVariant?.name}
            </span>
            {product &&
              product.currentVariant &&
              prices[product.currentVariant.id].length >= 1 && (
                <>
                  <div>
                    {product.currentVariant.metadata.original_price && (
                      <span
                        className={`text-2xl ${openSans.className} pl-6 text-[#474747B3] line-through`}
                      >
                        ${product.currentVariant.metadata.original_price}
                      </span>
                    )}
                    <span className={`text-2xl ${openSans.className} pl-6`}>
                      $
                      {parseFloat(
                        String(
                          Number(
                            prices[product.currentVariant.id]?.[0].unit_amount,
                          ) / 100,
                        ),
                      ).toFixed(2)}
                    </span>
                  </div>
                  {product.currentVariant.metadata.original_price &&
                    prices[product.currentVariant.id][0].unit_amount && (
                      <span
                        className={`pl-6 text-lg text-red-500 ${openSans.className}`}
                      >
                        You save&nbsp;$
                        {
                          getPriceDifference(
                            parseFloat(
                              product.currentVariant.metadata.original_price,
                            ),
                            prices[product.currentVariant.id][0].unit_amount! /
                              100,
                          ).dollarAmount
                        }
                        &nbsp;(
                        {
                          getPriceDifference(
                            parseFloat(
                              product.currentVariant.metadata.original_price,
                            ),
                            prices[product.currentVariant.id][0].unit_amount! /
                              100,
                          ).percent
                        }
                        %)
                      </span>
                    )}
                  {product.currentVariant.metadata.shipping && (
                    <span
                      className={`mt-4 pl-6 text-sm text-[#575757] ${openSans.className}`}
                    >
                      FREE SHIPPING
                    </span>
                  )}
                  {prices[product.currentVariant.id].length > 1 && (
                    <>
                      <label
                        className={`${openSans.className} mt-10 pl-6 text-lg`}
                      >
                        Size
                      </label>
                      <select
                        className={`ml-6 mt-2 h-[56px] border border-gray-200 outline-none ${openSans.className}`}
                        onChange={setPriceLabel}
                        value={product.currentPrice.name}
                      >
                        {prices[product.currentVariant.id].map((price) => (
                          <option key={`${price.nickname}`}>
                            {price.nickname}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                  <label className={`${openSans.className} mt-10 pl-6 text-lg`}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={product.quantity}
                    className={`w-fit pb-4 pl-2 pr-2 pt-4 ${openSans.className} ml-6 h-[60px] w-[130px] border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent`}
                    onChange={handleQuantityChange}
                  />
                  <div className="mt-5 flex w-full gap-7 pl-6">
                    <button
                      className={`h-[60px] w-[170px] bg-[#49740B] text-center leading-[60px] text-white ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
                      onClick={goToCheckout}
                    >
                      B U Y &nbsp;N O W
                    </button>
                    <Link
                      href={"#"}
                      className={`h-[60px] w-[200px] bg-[#49740B] text-center leading-[60px] text-white ${openSans.className} mt-3 text-base font-bold hover:bg-lime-600`}
                    >
                      A D D &nbsp;T O &nbsp;C A R T
                    </Link>
                  </div>
                  <Link
                    href={`/shop/products/${product.variants[0].id}`}
                    className="mt-8 w-fit pl-6"
                  >
                    <span
                      className={`${openSans.className} text-lg text-[#49740B]`}
                    >
                      View Full Details
                    </span>
                    <FontAwesomeIcon
                      icon={faRightLong}
                      size="1x"
                      className="ml-1 text-[#49740B]"
                    />
                  </Link>
                </>
              )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <span
          className={`mb-6 text-center text-2xl md:hidden ${openSans.className}`}
        >
          {products.length >= 1
            ? productType
              ? `${productType.charAt(0).toUpperCase()}${productType.slice(1)}`
              : "All Products"
            : `0 results found for "${search}"`}
        </span>
        <ProductList itemCount={products.length} />
        <div className="flex w-full flex-col">
          <span className={`hidden text-2xl md:inline-flex`}>
            {products.length >= 1
              ? productType
                ? `${productType.charAt(0).toUpperCase()}${productType.slice(1)}`
                : "All Products"
              : `0 results found for "${search}"`}
          </span>
          <div className="relative mt-8 flex w-full flex-col justify-center gap-2 lg:flex-row lg:flex-wrap lg:justify-normal">
            {products.length > 1 && (
              <div
                className={`absolute right-0 top-[-70px] mr-3 flex w-[48%] cursor-pointer select-none items-center justify-end border text-[#5e5e5e] hover:text-gray-800 md:left-auto md:right-0 md:top-[-64px] md:ml-0 md:mr-3 md:w-fit md:border-none`}
                onClick={toggleSorts}
              >
                <span
                  className={`${openSans.className} w-full text-center text-3xl text-[#5e5e5e] md:w-fit md:text-left md:text-lg`}
                >
                  {sortDescriptions[sort as keyof typeof sortDescriptions]
                    ? sortDescriptions[sort as keyof typeof sortDescriptions]
                    : "Newest"}
                </span>
                <FontAwesomeIcon
                  icon={showSorts ? faCaretUp : faCaretDown}
                  size="1x"
                  className="ml-1 mr-1 md:mr-0"
                />
              </div>
            )}
            <div
              className={`${openSans.className} md: mobile-sortby-container absolute left-0 top-[-25px] ml-3 mr-3 h-fit w-full flex-col border border-gray-200 pb-7 pl-8 pr-8 pt-7 text-lg md:left-auto md:right-0 md:top-[-35px] md:mr-3 md:w-[250px] ${showSorts ? "flex" : "hidden"} z-10 select-none bg-white`}
            >
              <span
                className={`w-fit cursor-pointer pb-2 hover:text-[#49740B] ${(sort === "newest" || !sort) && "text-[#49740B]"}`}
                onClick={() => setSortParams("newest")}
              >
                Newest
              </span>
              <span
                className={`w-fit cursor-pointer pb-2 hover:text-[#49740B] ${sort === "az" && "text-[#49740B]"}`}
                onClick={() => setSortParams("az")}
              >
                Name (A-Z)
              </span>
              <span
                className={`w-fit cursor-pointer pb-2 hover:text-[#49740B] ${sort === "za" && "text-[#49740B]"}`}
                onClick={() => setSortParams("za")}
              >
                Name (Z-A)
              </span>
              <span
                className={`w-fit cursor-pointer pb-2 hover:text-[#49740B] ${sort === "lh" && "text-[#49740B]"}`}
                onClick={() => setSortParams("lh")}
              >
                Price (low-high)
              </span>
              <span
                className={`w-fit cursor-pointer hover:text-[#49740B] ${sort === "hl" && "text-[#49740B]"}`}
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
                    className={`flex w-full flex-col ${openSans.className} lg:w-[200px] xl:w-[300px]`}
                  >
                    <div className="group relative flex flex-col">
                      {product.metadata.original_price && (
                        <span className="absolute right-0 top-0 ml-auto bg-[#49740B] pb-1 pl-4 pr-4 pt-1 text-xs text-white lg:pb-2 lg:pl-6 lg:pr-6 lg:pt-2 lg:text-sm">
                          sale
                        </span>
                      )}
                      <button
                        className={`absolute bottom-0 left-0 z-10 hidden h-[30px] w-full bg-white text-black shadow-md xl:h-[50px] ${!productView && "group-hover:lg:block"}`}
                        onClick={(e) => showQuickView(e, product)}
                      >
                        + Quick view
                      </button>
                      <Image
                        src={`${product.images[0]}`}
                        alt={`${product.name}`}
                        width={0}
                        height={0}
                        sizes="(max-width: 1023px) 100%, (min-width: 1024px) 200px, (min-width: 1280px) 300px"
                        className="ml-auto mr-auto h-[300px] w-full object-contain lg:h-[200px] lg:w-[200px] xl:h-[300px] xl:w-[300px]"
                        priority
                      />
                    </div>
                    {product.metadata.shipping && (
                      <span className="text-sm text-[#575757]">
                        FREE SHIPPING
                      </span>
                    )}
                    <span className="text-lg">{product.name}</span>
                    {itemPrices.length > 1 ? (
                      <>
                        <span>
                          From $
                          {parseFloat(
                            String(Number(itemPrices[0].unit_amount) / 100),
                          ).toFixed(2)}
                        </span>
                        {product.metadata.original_price && (
                          <span>{product.metadata.original_price}</span>
                        )}
                        <span className="mt-4 text-sm text-[#595959]">
                          More options
                        </span>
                      </>
                    ) : (
                      <div>
                        {product.metadata.original_price && (
                          <span className="text-[#474747B3] line-through">
                            ${product.metadata.original_price}
                          </span>
                        )}
                        <span
                          className={`text-base ${product.metadata.original_price && "ml-3"}`}
                        >
                          $
                          {parseFloat(
                            String(Number(itemPrices[0].unit_amount) / 100),
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
      </div>
    </div>
  )
}
