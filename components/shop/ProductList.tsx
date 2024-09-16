"use client"
import { Open_Sans } from "next/font/google"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
const openSans = Open_Sans({ subsets: ["latin"] })
export default function ProductList() {
  const params = useSearchParams()
  const productType = params.get("type")
  const search = params.get("search")
  return (
    <div
      className={`flex flex-col w-[35%] mt-10 text-sm mr-3  lg:text-lg ${openSans.className} ml-2`}
    >
      <Link
        href={"/shop"}
        className={`${!productType && !search ? "font-bold text-[#49740b]" : "hover:text-[#304f05]"} w-fit whitespace-nowrap`}
      >
        All Products
      </Link>
      <Link
        href={"/shop?type=tshirts"}
        className={`mt-5 ${productType === "tshirts" && "font-bold text-[#49740b]"} hover:text-[#304f05] w-fit whitespace-nowrap`}
      >
        T-Shirts
      </Link>
      <Link
        href={"/shop?type=backpacks"}
        className={`mt-5 ${productType === "backpacks" && "font-bold text-[#49740b]"} hover:text-[#304f05] w-fit whitespace-nowrap`}
      >
        Drawstring Backpacks
      </Link>
      <Link
        href={"/shop?type=bottles"}
        className={`mt-5 ${productType === "bottles" && "font-bold text-[#49740b]"} hover:text-[#304f05] w-fit whitespace-nowrap`}
      >
        Sports Water Bottles
      </Link>
      <Link
        href={"/shop?type=lunch"}
        className={`mt-5 ${productType === "lunch" && "font-bold text-[#49740b]"} hover:text-[#304f05] w-fit whitespace-nowrap`}
      >
        Bags- Lunch, coolers
      </Link>
    </div>
  )
}
