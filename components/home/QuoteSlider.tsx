"use client"
import { useState, useEffect } from "react"
export default function QuoteSlider() {
  const allItems = [
    { id: 1, name: "Person 1", quote: "Quote 1" },
    { id: 2, name: "Person 2", quote: "Quote 2" },
    { id: 3, name: "Person 3", quote: "Quote 3" },
    { id: 4, name: "Person 4", quote: "Quote 4" },
    { id: 5, name: "Person 5", quote: "Quote 5" },
    { id: 6, name: "Person 6", quote: "Quote 6" },
    { id: 7, name: "Person 7", quote: "Quote 7" },
    { id: 8, name: "Person 8", quote: "Quote 8" },
    { id: 9, name: "Person 9", quote: "Quote 9" },
    { id: 10, name: "Person 10", quote: "Quote 10" },
    { id: 11, name: "Person 11", quote: "Quote 11" },
    { id: 12, name: "Person 12", quote: "Quote 12" },
    { id: 13, name: "Person 13", quote: "Quote 13" },
    { id: 14, name: "Person 14", quote: "Quote 14" },
  ]
  const itemsPerTransition = 5
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + itemsPerTransition) % allItems.length
      )
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  const currentItems = [
    ...allItems.slice(currentIndex, currentIndex + itemsPerTransition),
    ...allItems.slice(
      0,
      Math.max(0, currentIndex + itemsPerTransition - allItems.length)
    ),
  ]

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {currentItems.map((item) => (
        <div
          className="bg-black w-[200px] h-[200px] flex flex-col text-white items-center justify-center fade-in"
          key={item.id}
        >
          <span className="m-3">{item.name}</span>
          <span>{item.quote}</span>
        </div>
      ))}
    </div>
  )
}
