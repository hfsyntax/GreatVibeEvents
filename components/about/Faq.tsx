"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })
import { useState } from "react"
export default function Faq() {
  const [dropDownsOpen, setDropdownsOpen] = useState<boolean[]>([
    false,
    false,
    false,
  ])
  const toggleDropDown = (index: number) => {
    const singleDropDownChanged = dropDownsOpen.map((dropdown, i) =>
      i === index ? !dropdown : dropdown
    )
    setDropdownsOpen(singleDropDownChanged)
  }
  return (
    <>
      <div
        className={`flex flex-col w-[800px] border-b-[1px] border-gray-200 box-border items-center ml-auto mr-auto ${openSans.className} mt-10 select-none cursor-pointer`}
      >
        <div
          className="w-full pb-3 hover:first:text-[#49740B]"
          onClick={() => toggleDropDown(0)}
        >
          <span
            className={`text-2xl w-full text-left ${dropDownsOpen[0] && "text-[#49740B]"}`}
          >
            What is the mission of Great Vibe Events?
          </span>
          <FontAwesomeIcon
            icon={dropDownsOpen[0] ? faCaretUp : faCaretDown}
            size="lg"
            className="float-right text-[#49740B] cursor-pointer"
            onClick={() => toggleDropDown(0)}
          />
        </div>
        {dropDownsOpen[0] && (
          <p className="p-3 text-lg text-[#575757] select-text cursor-text">
            Great Vibe Events (GVE) is a nonprofit organization that aims to
            create positive and meaningful experiences for people with
            disabilities aged 18 and above. GVE organizes various events and
            activities, such as social gatherings, healthy eating workshops,
            fitness classes, and mental skills training, that cater to the
            diverse needs and interests of people with disabilities. Through
            these events and activities, GVE strives to promote a sense of
            community, well-being, and empowerment among people with
            disabilities. GVE is committed to providing high-quality and
            impactful events and activities that support the physical,
            emotional, and social development of people with disabilities. GVE
            believes that everyone deserves to have fun, learn new things, and
            make friends.
          </p>
        )}
      </div>
      <div
        className={`flex flex-col w-[800px] border-b-[1px] border-gray-200 box-border items-center ml-auto mr-auto ${openSans.className} select-none cursor-pointer`}
      >
        <div
          className="w-full pb-3 pt-3 hover:first:text-[#49740B]"
          onClick={() => toggleDropDown(1)}
        >
          <span
            className={`text-2xl w-full text-left ${dropDownsOpen[1] && "text-[#49740B]"}`}
          >
            What types of events does Great Vibe Events host?
          </span>
          <FontAwesomeIcon
            icon={dropDownsOpen[1] ? faCaretUp : faCaretDown}
            size="lg"
            className="float-right text-[#49740B] cursor-pointer"
            onClick={() => toggleDropDown(1)}
          />
        </div>

        {dropDownsOpen[1] && (
          <>
            <p className="text-lg text-[#575757] p-3 cursor-text select-text">
              Great Vibe Events (GVE) is a non-profit organization that aims to
              promote social inclusion, wellness, and happiness for people with
              disabilities. We organize a variety of events and activities that
              cater to different interests and needs of our participants. Here
              are some examples of what we offer:
            </p>
            <ul className="p-3 text-lg text-[#575757] cursor-text select-text">
              <li>
                <strong>- Social events:</strong> These are fun and interactive
                events that help our participants make new friends, express
                themselves, and enjoy themselves. Some of the social events we
                host are dances, karaoke nights, potluck dinners, game nights,
                movie nights, and more.
              </li>
              <li>
                <strong>- Nutritional events:</strong> These are events that
                teach our participants how to eat healthily, cook delicious
                meals, and improve their well-being. Some of the nutritional
                events we host are cooking demonstrations, nutrition education
                workshops, healthy eating challenges, and more.
              </li>
              <li>
                <strong>- Exercise programs:</strong> These are programs that
                help our participants stay fit, active, and flexible. Some of
                the exercise programs we offer are adaptive sports, fitness
                classes, yoga classes, and more.
              </li>
              <li>
                <strong>- Mental skills clinics:</strong> These are clinics that
                help our participants sharpen their cognitive abilities, enhance
                their creativity, and boost their confidence. Some of the mental
                skills clinics we offer are problem-solving workshops, memory
                training workshops, creative writing workshops, and more.
              </li>
            </ul>
          </>
        )}
      </div>
      <div
        className={`flex flex-col w-[800px] border-b-[1px] border-gray-200 box-border items-center ml-auto mr-auto ${openSans.className} select-none cursor-pointer`}
      >
        <div
          className="w-full pt-3 pb-3 hover:first:text-[#49740B]"
          onClick={() => toggleDropDown(2)}
        >
          <span
            className={`text-2xl w-full text-left ${dropDownsOpen[2] && "text-[#49740B]"}`}
          >
            Can I designate my donation to a specific program or service?
          </span>
          <FontAwesomeIcon
            icon={dropDownsOpen[2] ? faCaretUp : faCaretDown}
            size="lg"
            className="float-right text-[#49740B] cursor-pointer"
            onClick={() => toggleDropDown(2)}
          />
        </div>

        {dropDownsOpen[2] && (
          <p className="p-3 text-lg text-[#575757] cursor-text select-text">
            Yes, you can designate your donation to a specific program or
            service offered by Great Vibe Events. Please indicate your
            preference when making your donation.
          </p>
        )}
      </div>
    </>
  )
}
