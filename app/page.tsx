import Image from "next/image"
import Link from "next/link"
import { Playfair_Display, Open_Sans } from "next/font/google"
import QuoteSlider from "@/components/home/QuoteSlider"
import Schedule from "@/components/home/Schedule"
import type { Weekday } from "@/components/home/Schedule"
const playfairDisplay = Playfair_Display({ subsets: ["latin"] })
const openSans = Open_Sans({ subsets: ["latin"] })
export default async function Home() {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    weekday: "short",
  }
  const dateFormatter = new Intl.DateTimeFormat("en-US", options)
  const dayOfWeek = dateFormatter.format(new Date()) as Weekday
  return (
    <>
      <div className="w-full flex flex-col md:flex-row">
        <Image
          src={"/logo_welcome.png"}
          height={0}
          width={0}
          sizes="50%"
          alt="logo_welcome"
          className="w-1/2 h-auto mr-auto ml-auto object-contain"
          priority
        />
        <div className="bg-[#DAFFC0] p-10 flex flex-col justify-center ml-auto mr-auto w-full md:w-1/2">
          <span
            className={`${openSans.className} text-center text-lg mb-4 text-[#49740B]`}
          >
            WELCOME
          </span>
          <span className={`text-5xl ${playfairDisplay.className} mb-4`}>
            Inclusive Events for people with physical and intellectual
            disabilities 18+
          </span>
          <span className={`text-xl text-[#575757] ${openSans.className}`}>
            Where phenomenal people get together for Great Times!
          </span>
          <Link
            href={"#"}
            className="m-6 bg-[#49740B] text-white text-base text-center block p-4 font-bold hover:bg-lime-600"
          >
            JOIN US
          </Link>
        </div>
      </div>
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full">
        <span>content ad space</span>
      </div>
      <Image
        src={"/event_image.png"}
        height={0}
        width={0}
        sizes="100%"
        alt="logo_welcome"
        className="w-full h-auto"
        priority
      />
      <span
        className={`text-lg mt-6 text-[#49740B] ${openSans.className} mb-8`}
      >
        SATURDAY, AUGUST 10th, 2024
      </span>
      <div className="flex flex-col mb-10 lg:flex-row">
        <div className="w-full flex flex-col lg:w-[70%]">
          <span className={`mb-6 text-2xl ${openSans.className}`}>
            SUMMER SLAM SOLD OUT
          </span>
          <strong className={`text-lg text-gray-500 ${openSans.className}`}>
            NO WALK UP TICKET SALES -ONLY ON-LINE PURCHASE
          </strong>
          <strong className={`text-lg text-gray-500 ${openSans.className}`}>
            Get ready for an electrifying experience at the Great Vibe Events
            Summer Slam!
          </strong>
          <strong className={`text-lg text-gray-500 ${openSans.className}`}>
            Date: Saturday, August 10th ⏰ Time: 4:00 PM to 7:00 PM 📍 Location:
            Unity of Fairfax, 2854 Hunter Mill Rd, Oakton, VA 22124
          </strong>
          <strong className={`text-lg text-gray-500 ${openSans.className}`}>
            Here’s what awaits you:
          </strong>
          <ol className={`text-lg list-inside ml-4 ${openSans.className}`}>
            <li>
              <strong className="text-gray-500">Dance the Night Away</strong>:
              Our DJ will spin the hottest tracks, creating an irresistible
              groove that’ll have you moving and shaking. Whether you’re a
              seasoned dancer or just love to sway, this is your moment!
            </li>
            <li className="mt-3">
              <strong className="text-gray-500">Dance the Night Away</strong>:
              Our DJ will spin the hottest tracks, creating an irresistible
              groove that’ll have you moving and shaking. Whether you’re a
              seasoned dancer or just love to sway, this is your moment!
            </li>
            <li className="mt-3">
              <strong className="text-gray-500">Dance the Night Away</strong>:
              Our DJ will spin the hottest tracks, creating an irresistible
              groove that’ll have you moving and shaking. Whether you’re a
              seasoned dancer or just love to sway, this is your moment!
            </li>
            <li className="mt-3">
              <strong className="text-gray-500">Dance the Night Away</strong>:
              Our DJ will spin the hottest tracks, creating an irresistible
              groove that’ll have you moving and shaking. Whether you’re a
              seasoned dancer or just love to sway, this is your moment!
            </li>
          </ol>
        </div>
        <div className="w-full lg:w-[30%] pr-6 pl-6 h-fit bg-[#DAFFC0] flex flex-col justify-center">
          <span className="pl-8 pr-8 mt-8 block text-2xl mb-6">
            SUMMER SLAM IS SOLD OUT-GVE OCTOBER HALLOWEEN FEST COMING SOON!
          </span>
          <Link
            href={"#"}
            className="mr-6 ml-6 mb-6 bg-[#49740B] text-white text-base block p-4 font-bold hover:bg-lime-600"
          >
            PURCHASE TICKET
          </Link>
        </div>
      </div>
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full">
        <span>content ad space</span>
      </div>
      <span className={`text-[#49740B] text-lg ${openSans.className} mb-8`}>
        GREAT TIMES AND GREAT PEOPLE CREATE GREAT VIBES!
      </span>
      <div className="w-full h-[500px] flex overflow-auto gap-3">
        <Image
          src={"/event_image.png"}
          height={0}
          width={0}
          sizes="100%"
          alt="logo_welcome"
          className="w-full h-auto object-contain"
          priority
        />
        <Image
          src={"/event_image.png"}
          height={0}
          width={0}
          sizes="100%"
          alt="logo_welcome"
          className="w-full h-auto object-contain"
          priority
        />
        <Image
          src={"/event_image.png"}
          height={0}
          width={0}
          sizes="100%"
          alt="logo_welcome"
          className="w-full h-auto object-contain"
          priority
        />
        <Image
          src={"/event_image.png"}
          height={0}
          width={0}
          sizes="100%"
          alt="logo_welcome"
          className="w-full h-auto object-contain"
          priority
        />
      </div>
      <p className={`${openSans.className} text-lg mt-5`}>
        [mission statement here]
      </p>

      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full">
        <span>content ad space</span>
      </div>
      <QuoteSlider />
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full">
        <span>content ad space</span>
      </div>
      <span
        className={`${playfairDisplay.className} w-full text-center text-4xl mb-8`}
      >
        Sign up for gve's monthly news letter
      </span>
      <span
        className={`${openSans.className} text-lg text-gray-500 mb-4 w-full text-center`}
      >
        Learn more about our upcoming events, fundraisers, and more!
      </span>
      <form className="w-full lg:w-fit ml-auto mr-auto">
        <input
          type="text"
          placeholder="Email address"
          className="block w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border lg:w-[600px] lg:mr-6 lg:inline focus:border-black"
          autoComplete="email"
        />
        <input
          type="submit"
          value={"SIGN UP"}
          className="w-full bg-[#49740B] text-white font-bold h-[50px] cursor-pointer lg:w-[150px] hover:bg-lime-600"
        />
      </form>
      <div className="bg-black text-white border-yellow-500 border-2 box-border w-full">
        <span>content ad space</span>
      </div>
      <div className="w-full bg-[#DAFFC0] p-10 flex flex-col">
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
        <Link
          href={"#"}
          className="mt-6 mb-6 ml-auto mr-auto bg-[#49740B] text-white text-base text-center block p-4 w-fit font-bold hover:bg-lime-600"
        >
          DROP US AN EMAIL
        </Link>
      </div>
    </>
  )
}
