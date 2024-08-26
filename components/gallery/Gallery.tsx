import Image from "next/image"
export default function Gallery({ images }: { images: number }) {
  return (
    <div className="flex flex-wrap w-full mt-10">
      {Array(images)
        .fill(null)
        .map((_, index) => (
          <div
            className="relative overflow-hidden w-1/2 h-[100px] md:h-[200px] xl:h-[300px] xl:w-1/4 "
            key={`img_container_${index + 1}`}
          >
            <Image
              src={`/gve-gallery/${index + 1}.png`}
              alt="Zoomable Image"
              fill
              sizes="(max-width: 768px) 50%, 25%"
              priority
              key={`img_${index + 1}`}
              className="cursor-pointer object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </div>
        ))}
    </div>
  )
}
