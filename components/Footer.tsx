import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })
import Link from "next/link"
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
export default function Footer() {
  return (
    <div className="ml-auto mr-auto mt-14 flex w-full flex-col">
      <div className="mb-14 flex flex-col">
        <div className="ml-auto mr-auto">
          <Link
            href={"https://www.facebook.com/188549064338074"}
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              size="lg"
              className="mr-3 text-blue-500"
            />
          </Link>

          <Link
            href={"https://www.instagram.com/greatvibeevent"}
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              size="lg"
              className="mr-3 text-[#E1306C]"
            />
          </Link>

          <Link href={"https://www.x.com/greatvibeevents"} target="_blank">
            <FontAwesomeIcon icon={faXTwitter} size="lg" className="mr-3" />
          </Link>

          <Link
            href={"https://www.youtube.com/@greatvibeevents"}
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faYoutube}
              size="lg"
              className="text-red-500"
            />
          </Link>
        </div>
        <span
          className={`${openSans.className} mt-6 text-center text-sm text-gray-500`}
        >
          COPYRIGHT © {new Date().getFullYear()} GREAT VIBE EVENTS - ALL RIGHTS
          RESERVED.
        </span>
      </div>
      <div
        className={`mb-14 flex flex-col items-center justify-center gap-6 text-lg 2xl:text-xl ${openSans.className} text-[#8f6e6e] md:flex-row`}
      >
        <Link className="hover:text-black" href={"/"}>
          HOME
        </Link>
        <Link className="hover:text-black" href={"#"}>
          FORMS
        </Link>
        <Link className="hover:text-black" href={"/events"}>
          CALENDAR
        </Link>
        <Link className="uppercase hover:text-black" href={"/gallery"}>
          gve gallery
        </Link>
        <Link className="hover:text-black" href={"#"}>
          Privacy Policy
        </Link>
        <Link className="hover:text-black" href={"#"}>
          Terms And Conditions
        </Link>
        <Link className="hover:text-black" href={"/#contact"}>
          Contact Us
        </Link>
      </div>
    </div>
  )
}
