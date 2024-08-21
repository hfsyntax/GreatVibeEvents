"use client"
import { Open_Sans } from "next/font/google"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
const openSans = Open_Sans({ subsets: ["latin"] })

export type Weekday = "Mon" | "Tue" | "Wed" | "Thurs" | "Fri" | "Sat" | "Sun"

export default function Schedule({ dayOfWeek }: { dayOfWeek: Weekday }) {
  const days = {
    Mon: "09:00 am – 05:00 pm",
    Tue: "09:00 am – 05:00 pm",
    Wed: "09:00 am – 05:00 pm",
    Thurs: "09:00 am – 05:00 pm",
    Fri: "09:00 am – 05:00 pm",
    Sat: "Sat Closed",
    Sun: "Sun Closed",
  }
  const [dropDownOpen, setDropdownOpen] = useState<boolean>(false)
  const toggleDropDown = () => setDropdownOpen(!dropDownOpen)
  return (
    <div className={`ml-auto mr-auto text-lg ${openSans.className}`}>
      {dropDownOpen ? (
        <>
          <span className={dayOfWeek === "Mon" ? "font-bold" : ""}>
            Mon 09:00 am – 05:00 pm
          </span>
          <FontAwesomeIcon
            icon={faCaretUp}
            size="lg"
            className="ml-2 text-[#49740B] cursor-pointer"
            onClick={toggleDropDown}
          />
          <span className={dayOfWeek === "Tue" ? "font-bold block" : "block"}>
            Tue 09:00 am – 05:00 pm
          </span>
          <span className={dayOfWeek === "Wed" ? "font-bold block" : "block"}>
            Wed 09:00 am – 05:00 pm
          </span>
          <span className={dayOfWeek === "Thurs" ? "font-bold block" : "block"}>
            Thurs 09:00 am – 05:00 pm
          </span>
          <span className={dayOfWeek === "Fri" ? "font-bold block" : "block"}>
            Fri 09:00 am – 05:00 pm
          </span>
          <span className={dayOfWeek === "Sat" ? "font-bold block" : "block"}>
            Sat 09:00 am – 05:00 pm
          </span>
          <span className={dayOfWeek === "Sun" ? "font-bold block" : "block"}>
            Sun 09:00 am – 05:00 pm
          </span>
        </>
      ) : (
        <>
          <p className={`inline `}>
            <span className="text-gray-500">Open today</span>
            <span className="text-[#49740B] pl-1">{days[dayOfWeek]}</span>
          </p>
          <FontAwesomeIcon
            icon={faCaretDown}
            size="lg"
            className="ml-2 text-[#49740B] cursor-pointer"
            onClick={toggleDropDown}
          />
        </>
      )}
    </div>
  )
}
