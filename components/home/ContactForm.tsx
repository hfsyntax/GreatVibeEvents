"use client"
import Link from "next/link"
import Schedule from "@/components/home/Schedule"
import { useState } from "react"
import type { Weekday } from "@/components/home/Schedule"
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
      className={`w-full ${form ? "bg-transparent" : "bg-[#DAFFC0]"} p-10 flex flex-col`}
      id="contact"
    >
      {!form && (
        <>
          <span
            className={`${openSans.className} text-center text-lg mb-8 text-[#49740B]`}
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
            className={`text-lg text-[#575757] text-center mb-6 ${openSans.className}`}
          >
            2700 Ankeny Street, Oakton, Virginia 22124, United States
          </span>
          <Link
            className={`text-lg text-[#49740B] text-center mb-12 ${openSans.className}`}
            href={"tel:7034034913"}
          >
            703-403-4913
          </Link>
          <h4
            className={`text-2xl text-black text-center mb-6 ${openSans.className}`}
          >
            Hours
          </h4>
          <Schedule dayOfWeek={dayOfWeek} />
          <button
            className={`mt-6 mb-6 ml-auto mr-auto bg-[#49740B] text-white text-base text-center block p-4 w-fit font-bold hover:bg-lime-600`}
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
            className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border lg:w-[600px] lg:mr-6 lg:inline focus:border-black"
            autoComplete="name"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border lg:w-[600px] lg:mr-6 lg:inline focus:border-black"
            autoComplete="email"
            required
          />
          <textarea
            placeholder="Message"
            className="pl-3 h-[100px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
          />
          <span className={`${openSans.className} text-sm text-gray-500 ml-1`}>
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </span>
          <div>
            <input
              type="submit"
              value="SEND"
              className="w-full bg-[#49740B] text-white font-bold h-[50px] cursor-pointer lg:w-[150px] hover:bg-lime-600"
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
