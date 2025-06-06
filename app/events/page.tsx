import type { Metadata } from "next"
import Calendar from "@/components/events/Calendar"
import { getEvents } from "@/actions/server"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Great Vibe Events - Events",
  description: "Generated by create next app",
}

export default async function Events() {
  const initialEvents = await getEvents(8)
  return (
    <>
      <span
        className={`text-[#49740B] text-lg ${openSans.className} mt-10 ml-3 xl:ml-0`}
      >
        GREAT VIBE EVENTS
      </span>
      <span
        className={`text-[#575757] text-lg mt-4 ${openSans.className} ml-3 xl:ml-0`}
      >
        Calendar of fun, inclusive and exciting events
      </span>
      {<Calendar initalEvents={initialEvents} />}
      <span
        className={`text-[#49740B] text-lg ${openSans.className} mt-10 ml-3 xl:ml-0`}
      >
        OTHER MANAGED EVENTS
      </span>
    </>
  )
}
