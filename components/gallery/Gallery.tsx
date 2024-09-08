"use client"
import type { GalleryImage } from "@/actions/server"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faArrowRight,
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
        <div className="flex flex-wrap w-full mt-10">
          {imageUrls.map((imageUrl, index) => (
            <div
              className={`relative overflow-hidden w-1/2 h-[100px] md:h-[200px] xl:h-[300px] xl:w-1/4 ${showImage && showImage === imageUrl.url && "single-gallery-image-container"}`}
              key={`img_container_${index + 1}`}
            >
              {showImage && showImage === imageUrl.url && (
                <span className="absolute text-white bg-black h-fit ml-1 md:ml-5 xl:ml-10 mt-3 p-2">
                  {index + 1}/{imageUrls.length}
                </span>
              )}
              {showImage &&
                showImage === imageUrl.url &&
                imageUrls[index - 1] && (
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="z-10 mt-auto mb-auto ml-1 md:ml-3 xl:ml-10 cursor-pointer text-sm md:text-xl xl:text-2xl"
                    onClick={() => showSingleImage(index - 1)}
                  />
                )}
              {showImage && showImage === imageUrl.url && (
                <FontAwesomeIcon
                  icon={faX}
                  size={`xl`}
                  className="ml-auto mr-3 mt-3 cursor-pointer z-10"
                  onClick={closeSingleImage}
                />
              )}
              {showImage &&
                showImage === imageUrl.url &&
                imageUrls[index + 1] && (
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="z-10 mt-auto mb-auto mr-1 md:mr-5 xl:mr-10 cursor-pointer text-sm md:text-xl xl:text-2xl"
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
                className={`cursor-pointer ${showImage && showImage === imageUrl.url && "!w-[75%] !object-contain xl:!h-[500px] mt-auto mb-auto ml-auto mr-auto z-20"} object-cover transition-transform duration-300 ease-in-out transform hover:scale-110`}
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
          className="cursor-pointer select-none ml-auto mr-auto"
          onClick={showMore}
        >
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
      )}
      {errorMessage.current && (
        <span className="text-red-500 block mt-3">{errorMessage.current}</span>
      )}
    </>
  )
}
