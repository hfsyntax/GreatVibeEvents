"use client"
import type { QueryResultRow } from "@vercel/postgres"
import { militaryToTime } from "@/lib/utils"
import { getEventPayment } from "@/actions/server"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState, Fragment, FormEvent, useRef } from "react"
import { Playfair_Display, Open_Sans } from "next/font/google"
import ReCAPTCHA from "react-google-recaptcha"

const playfairDisplay = Playfair_Display({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"] })

export default function Calendar({
  initalEvents,
}: {
  initalEvents: Array<QueryResultRow>
}) {
  const router = useRouter()
  const recaptcha = useRef<(ReCAPTCHA | null)[]>([])
  const [error, setError] = useState<string>()
  const [events, setEvents] = useState(initalEvents)
  const [dropDownsOpen, setDropdownsOpen] = useState<boolean[]>(
    Array(initalEvents.length).fill(false)
  )
  const toggleDropDown = (index: number) => {
    const singleDropDownChanged = dropDownsOpen.map((dropdown, i) =>
      i === index ? !dropdown : dropdown
    )
    setDropdownsOpen(singleDropDownChanged)
  }

  const submitRecaptcha = async (index: number) => {
    try {
      const token = await recaptcha.current[index]?.executeAsync()
      const eventId = events?.[index]?.id
      if (!token) return setError("Error: could not set recaptcha token.")
      if (!eventId) return setError("Error: invalid event id.")
      const eventPayment = await getEventPayment(eventId)
      if (!eventPayment) {
        return router.push(`/checkout?event_id=${eventId}&token=${token}`)
      }
      return router.push(`/checkout?event_id=${eventId}`)
    } catch (error) {
      return setError("Error: internal server error.")
    }
  }

  return (
    <div className="flex flex-col w-full mt-8">
      {events.map((event, index) => (
        <Fragment key={`event_${event.id}`}>
          <div className="flex flex-col border-b-[1px] border-gray-400 box-border pb-8 xl:flex-row">
            <div className="flex flex-col grow basis-0 order-1">
              <span
                className={`${playfairDisplay.className} text-4xl text-[#49740B] ml-3 xl:ml-0`}
              >
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="bg-black w-full text-white mt-3">
                event image
              </span>
            </div>

            <div className="ml-auto mr-auto flex-shrink-0 xl:w-[600px] xl:ml-3 order-3 xl:order-2">
              <span
                className={`${openSans.className} text-2xl block w-full text-center xl:inline-flex xl:text-left `}
              >
                {event.name}
              </span>
              <div>
                <p
                  className={`text-gray-500 ${openSans.className} text-2xl pt-5 ${!dropDownsOpen[index] && "line-clamp-3"} ml-3 xl:ml-0`}
                >
                  {event.name === "FEBRUARY FUNFEST" && (
                    <strong>
                      Are you ready for a night of fun, friendship, and
                      creativity? Join us at the Great Vibe Events February
                      Funfest, where you can enjoy a variety of activities that
                      are accessible, inclusive, and exciting for individuals
                      with physical and intellectual disabilities 18 years and
                      older.
                    </strong>
                  )}
                  {event?.description}
                </p>
                {!event.description &&
                  dropDownsOpen[index] &&
                  event.name === "FEBRUARY FUNFEST" && (
                    <ul
                      className={`text-2xl list-inside list-disc text-[#575757] ${openSans.className} ml-3 xl:ml-0`}
                    >
                      <li>
                        <strong>In the GVE Dance Hall</strong>, you can dance
                        the night away to your favorite tunes and compete with
                        your friends in our GVE Dance hall sideline area .
                      </li>
                      <li>
                        <strong>In the GVE Game Room</strong>, you can choose
                        from hundreds of video and board games to suit your
                        preferences and skills . From classic games like chess
                        and Monopoly, to modern games like Mario Kart and Super
                        Smash Brothers, there is something for everyone in the
                        GVE Game Room.
                      </li>
                      <li>
                        <strong>In the GVE Art Room</strong>, you can unleash
                        your inner artist and designer by creating unique
                        jewelry pieces, drawing, coloring, painting, and more.
                        You will have access to all the materials and guidance
                        you need to express yourself and make something
                        beautiful.
                      </li>
                      <li>
                        <strong>
                          Hollywood Walk of Fame Picture Wall and GVE Photo
                          Booth
                        </strong>
                        , you can capture the memories of the night and share
                        them with your loved ones. You can pose with your
                        favorite celebrities, dress up in costumes and props,
                        and take home a souvenir photo of your fun-filled
                        experience.
                      </li>
                      <li>
                        <strong>Great Vibe Events Dinner Hall</strong> where you
                        will be served dinner and socialize with fellow great
                        vibers attending the event.
                      </li>
                    </ul>
                  )}
                {!event.description && (
                  <div
                    className="cursor-pointer select-none"
                    onClick={() => toggleDropDown(index)}
                  >
                    <FontAwesomeIcon
                      icon={dropDownsOpen[index] ? faMinus : faPlus}
                      size="1x"
                      className="text-[#49740B] ml-3 xl:ml-0"
                    />
                    <span
                      className={`mt-6 inline-block ml-3 ${openSans.className} text-[#49740B] text-lg`}
                    >
                      Event Details
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  className="bg-[#49740B] text-white text-base text-center block w-full p-4  font-bold hover:bg-lime-600 mt-3"
                  onClick={() => submitRecaptcha(index)}
                >
                  Purchase Ticket
                </button>
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    size="invisible"
                    ref={(element) => {
                      recaptcha.current[index] = element
                    }}
                  />
                )}
                {error && <span className="text-red-500">{error}</span>}
              </div>
            </div>
            <div className="grow basis-0 ml-auto mr-auto order-2 xl:order-3">
              <span
                className={`${openSans.className} text-2xl block text-center xl:text-right`}
              >
                {militaryToTime(event.start_time)} -&nbsp;
                {militaryToTime(event.end_time)}
              </span>
              <span
                className={`${openSans.className} text-2xl text-gray-500 block text-center xl:text-right`}
              >
                Unity of Fairfax 2854 Hunter Mill Rd, Oakton, VA 22124
              </span>
            </div>
          </div>
          <div className="bg-black text-white border-yellow-500 border-2 box-border w-full h-[90px] mt-8 mb-8">
            <span>content ad space</span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
