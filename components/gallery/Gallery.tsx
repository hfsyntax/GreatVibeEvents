"use client"
import type { GalleryImage } from "@/types"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCaretLeft,
  faCaretRight,
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import { getGalleryImageUrls } from "@/actions/server"
import { useEffect, useState, useRef } from "react"
import { Open_Sans } from "next/font/google"

const openSans = Open_Sans({ subsets: ["latin"] })

export default function Gallery({ images }: { images: Array<GalleryImage> }) {
  const [numImages, setNumImages] = useState(8)
  const [imageUrls, setImageUrls] = useState<Array<GalleryImage>>(images)
  const [showImage, setShowImage] = useState<string>()
  const initialRender = useRef<boolean>(false)
  const canRequestMore = useRef<boolean>(true)
  const errorMessage = useRef<string>()

  const showMore = () => {
    if (canRequestMore.current) {
      setNumImages(numImages + 8)
    }
  }

  const showSingleImage = (index: number) => {
    setShowImage(imageUrls[index].url)
  }

  const closeSingleImage = () => {
    setShowImage("")
  }

  useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true
    } else {
      try {
        getGalleryImageUrls(numImages).then((response) => {
          if (!response.more) {
            canRequestMore.current = false
          }
          setImageUrls(response.items)
        })
      } catch (error: any) {
        errorMessage.current = error.message
      }
    }
  }, [numImages])
  return (
    <>
      {imageUrls.length > 0 && (
        <div className="mt-10 flex w-full flex-wrap">
          {imageUrls.map((imageUrl, index) => (
            <div
              className={`relative h-[100px] w-1/2 overflow-hidden md:h-[200px] xl:h-[300px] xl:w-1/4 ${showImage && showImage === imageUrl.url && "single-gallery-image-container hide-scroll backdrop-blur-lg"}`}
              key={`img_container_${index + 1}`}
            >
              {showImage && showImage === imageUrl.url && (
                <span className="absolute ml-1 mt-3 h-fit bg-black p-2 text-white md:ml-5 xl:ml-10">
                  {index + 1}/{imageUrls.length}
                </span>
              )}
              {showImage &&
                showImage === imageUrl.url &&
                imageUrls[index - 1] && (
                  <FontAwesomeIcon
                    icon={faCaretLeft}
                    className="z-10 mb-auto ml-1 mt-auto cursor-pointer rounded-full bg-black p-2 pl-3 pr-3 text-sm text-white md:ml-3 md:pl-[14px] md:pr-[14px] md:text-xl xl:ml-10 xl:text-2xl"
                    onClick={() => showSingleImage(index - 1)}
                  />
                )}
              {showImage && showImage === imageUrl.url && (
                <FontAwesomeIcon
                  icon={faX}
                  size={`xl`}
                  className="z-10 ml-auto mr-3 mt-3 cursor-pointer text-white"
                  onClick={closeSingleImage}
                />
              )}
              {showImage &&
                showImage === imageUrl.url &&
                imageUrls[index + 1] && (
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className="z-10 mb-auto mr-1 mt-auto cursor-pointer rounded-full bg-black p-2 pl-3 pr-3 text-sm text-white md:mr-5 md:pl-[14px] md:pr-[14px] md:text-xl xl:mr-10 xl:text-2xl"
                    onClick={() => showSingleImage(index + 1)}
                  />
                )}
              <Image
                src={`${imageUrl.url}`}
                alt="Zoomable Image"
                fill
                sizes="(max-width: 768px) 50%, 25%"
                key={`img_${index + 1}`}
                priority
                className={`cursor-pointer ${showImage && showImage === imageUrl.url && "z-20 mb-auto ml-auto mr-auto mt-auto !w-[75%] !object-contain xl:!h-[500px]"} transform object-cover transition-transform duration-300 ease-in-out hover:scale-110`}
                onClick={
                  showImage ? closeSingleImage : () => showSingleImage(index)
                }
              />
            </div>
          ))}
        </div>
      )}
      {canRequestMore.current && (
        <div
          className="ml-auto mr-auto cursor-pointer select-none"
          onClick={showMore}
        >
          <FontAwesomeIcon
            icon={faPlus}
            size="1x"
            className="ml-3 text-[#49740B] xl:ml-0"
          />
          <span
            className={`ml-3 mt-6 inline-block ${openSans.className} text-lg text-[#49740B]`}
          >
            Show More
          </span>
        </div>
      )}
      {errorMessage.current && (
        <span className="mt-3 block text-red-500">{errorMessage.current}</span>
      )}
    </>
  )
}
