"use client"
import { Open_Sans } from "next/font/google"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
const openSans = Open_Sans({ subsets: ["latin"] })
export default function ProductList({ itemCount }: { itemCount: number }) {
  const [categoriesVisible, setCategoriesVisible] = useState(false)
  const params = useSearchParams()
  const productType = params.get("type")
  const search = params.get("search")

  const toggleCategoriesMobile = () => setCategoriesVisible(!categoriesVisible)

  const closeCategoriesMobile = () => {
    if (categoriesVisible) setCategoriesVisible(false)
  }

  return (
    <div className="flex flex-col">
      <button
        className={`${itemCount > 1 ? "w-[48%]" : "mobile-sortby-container w-full"} border border-gray-200 text-3xl text-[#5e5e5e] ${openSans.className} ml-3 mr-3 md:hidden`}
        onClick={toggleCategoriesMobile}
      >
        Categories
      </button>
      <div
        className={`fixed right-0 top-0 z-10 box-border border border-black md:border-none ${categoriesVisible ? "mobile-category-container flex" : "hidden"} h-screen w-[80vw] flex-col bg-white pl-6 text-sm md:relative md:right-auto md:top-auto md:z-0 md:mr-3 md:mt-10 md:flex md:h-auto md:w-auto md:pl-0 lg:text-lg ${openSans.className} md:ml-2`}
      >
        <FontAwesomeIcon
          icon={faX}
          size="xl"
          className="ml-auto mr-3 mt-3 cursor-pointer md:!hidden"
          onClick={closeCategoriesMobile}
        />
        <Link
          href={"/shop"}
          className={`${!productType && !search ? "font-bold text-[#49740b]" : "hover:text-[#304f05]"} mt-20 w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 md:mt-0 md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          All Products
        </Link>
        <Link
          href={"/shop?type=tshirts"}
          className={`mt-5 ${productType === "tshirts" && "font-bold text-[#49740b]"} w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 hover:text-[#304f05] md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          T-Shirts
        </Link>
        <Link
          href={"/shop?type=backpacks"}
          className={`mt-5 ${productType === "backpacks" && "font-bold text-[#49740b]"} w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 hover:text-[#304f05] md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          Drawstring Backpacks
        </Link>
        <Link
          href={"/shop?type=bottles"}
          className={`mt-5 ${productType === "bottles" && "font-bold text-[#49740b]"} w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 hover:text-[#304f05] md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          Sports Water Bottles
        </Link>
        <Link
          href={"/shop?type=earmuffs"}
          className={`mt-5 ${productType === "earmuffs" && "font-bold text-[#49740b]"} w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 hover:text-[#304f05] md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          Earmuffs
        </Link>
        <Link
          href={"/shop?type=lunch"}
          className={`mt-5 ${productType === "lunch" && "font-bold text-[#49740b]"} w-full whitespace-nowrap border border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pb-5 hover:text-[#304f05] md:w-fit md:border-none md:pb-0`}
          onClick={closeCategoriesMobile}
        >
          Bags- Lunch, coolers
        </Link>
      </div>
    </div>
  )
}
