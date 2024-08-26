"use client"
import Gallery from "@/components/gallery/Gallery"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })
export default function GalleryLoader() {
  const [images, setImages] = useState(8)
  return (
    <>
      <Gallery images={images} />
      <div className="cursor-pointer select-none ml-auto mr-auto">
        <FontAwesomeIcon
          icon={faPlus}
          size="1x"
          className="text-[#49740B] ml-3 xl:ml-0"
        />
        <span
          className={`mt-6 inline-block ml-3 ${openSans.className} text-[#49740B] text-lg`}
        >
          Show More
        </span>
      </div>
    </>
  )
}
