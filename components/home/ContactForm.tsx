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
    <div className={`flex w-full flex-col bg-[#fefefe] p-10`} id="contact">
      {!form && (
        <>
          <span
            className={`${openSans.className} mb-8 text-center text-lg text-[#161616]`}
          >
            CONTACT US
          </span>
          <span
            className={`text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl ${openSans.className} mb-6 text-center`}
          >
            Inclusive Events for People with Special Abilities
          </span>
          <span
            className={`text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl ${openSans.className} mb-6 text-center`}
          >
            Great Vibe Events
          </span>
          <span
            className={`text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl ${openSans.className} mb-6 text-center`}
          >
            Call:&nbsp;
            <Link href="tel:7037746869" target="_blank">
              703-774-6869
            </Link>
          </span>
          <div
            className="group ml-auto mr-auto mt-8 flex h-[56px] w-fit cursor-pointer select-none items-center justify-center gap-2 border border-black pb-2 pl-4 pr-4 pt-2 transition-colors delay-[50ms] ease-in-out hover:bg-black"
            onClick={toggleForm}
          >
            <hr className="w-4 border-black group-hover:border-white" />
            <span
              className={`${openSans.className} text-base font-bold uppercase tracking-widest text-black group-hover:text-white`}
            >
              drop us an email
            </span>
            <hr className="w-4 border-black group-hover:border-white" />
          </div>
        </>
      )}
      {form && (
        <form className="ml-auto mr-auto flex w-full flex-col gap-3 md:w-[600px] xl:w-[550px]">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="box-border h-[50px] border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
            autoComplete="name"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email*"
            className="box-border h-[50px] border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
            autoComplete="email"
            required
          />
          <input
            type="text"
            name="info"
            placeholder="Where did you hear about us?"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
            required
          />
          <textarea
            placeholder="Tell us more about how you'd like to get involved."
            className="box-border h-[100px] w-full border-[1px] border-b-gray-200 bg-transparent pl-3 pt-4 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black"
          />
          <span
            className={`${openSans.className} text-center text-sm text-gray-500`}
          >
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </span>
          <div className="mt-8 flex flex-col items-center justify-center lg:flex-row lg:gap-2">
            <div className="group flex h-[56px] w-full cursor-pointer select-none items-center justify-center gap-2 border border-black pb-2 pl-4 pr-4 pt-2 transition-colors delay-[50ms] ease-out hover:bg-black lg:w-fit">
              <hr className="w-4 border-black group-hover:border-white" />
              <span
                className={`${openSans.className} text-base font-bold uppercase tracking-widest text-black group-hover:text-white`}
              >
                Send
              </span>
              <hr className="w-4 border-black group-hover:border-white" />
            </div>
            <button
              type="button"
              className="mt-3 underline lg:mt-0"
              onClick={toggleForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
