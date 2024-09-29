"use client"
import Link from "next/link"
import Schedule from "@/components/home/Schedule"
import { useState } from "react"
import type { Weekday } from "@/types"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })

export default function ContactForm() {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    weekday: "short",
  }
  const dateFormatter = new Intl.DateTimeFormat("en-US", options)
  const dayOfWeek = dateFormatter.format(new Date()) as Weekday
  const [form, showForm] = useState(false)
  const toggleForm = () => showForm(!form)
  return (
    <div
      className={`w-full ${form ? "bg-transparent" : "bg-[#DAFFC0]"} flex flex-col p-10`}
      id="contact"
    >
      {!form && (
        <>
          <span
            className={`${openSans.className} mb-8 text-center text-lg text-[#49740B]`}
          >
            CONTACT US
          </span>
          <span className={`text-2xl ${openSans.className} mb-6 text-center`}>
            Inclusive Events for People with special abilities
          </span>
          <span className={`text-2xl ${openSans.className} mb-6 text-center`}>
            Great Vibe Events
          </span>
          <span
            className={`mb-6 text-center text-lg text-[#575757] ${openSans.className}`}
          >
            2700 Ankeny Street, Oakton, Virginia 22124, United States
          </span>
          <Link
            className={`mb-12 ml-auto mr-auto w-fit text-lg text-[#49740B] ${openSans.className}`}
            href={"tel:7034034913"}
          >
            703-403-4913
          </Link>
          <h4
            className={`mb-6 text-center text-2xl text-black ${openSans.className}`}
          >
            Hours
          </h4>
          <Schedule dayOfWeek={dayOfWeek} />
          <button
            className={`mb-6 ml-auto mr-auto mt-6 block w-fit bg-[#49740B] p-4 text-center text-base font-bold text-white hover:bg-lime-600`}
            onClick={toggleForm}
          >
            DROP US AN EMAIL
          </button>
        </>
      )}
      {form && (
        <form className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black lg:mr-6 lg:inline lg:w-[600px]"
            autoComplete="name"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black lg:mr-6 lg:inline lg:w-[600px]"
            autoComplete="email"
            required
          />
          <textarea
            placeholder="Message"
            className="box-border h-[100px] border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
          />
          <span className={`${openSans.className} ml-1 text-sm text-gray-500`}>
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </span>
          <div>
            <input
              type="submit"
              value="SEND"
              className="h-[50px] w-full cursor-pointer bg-[#49740B] font-bold text-white hover:bg-lime-600 lg:w-[150px]"
              disabled
            />
            <button
              type="button"
              className="ml-3 underline"
              onClick={toggleForm}
            >
              cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
