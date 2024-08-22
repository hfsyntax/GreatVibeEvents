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
    <div className="flex flex-col mt-14 ml-auto mr-auto w-full xl:w-[1232px]">
      <div className="flex flex-col mb-14 sm:flex-row">
        <span className={`${openSans.className} text-sm text-gray-500 ml-1`}>
          COPYRIGHT © {new Date().getFullYear()} GREAT VIBE EVENTS - ALL RIGHTS
          RESERVED.
        </span>
        <div className="mr-auto ml-auto sm:ml-auto sm:mr-28">
          <Link href={"#"}>
            <FontAwesomeIcon
              icon={faFacebook}
              size="lg"
              className="mr-3 text-blue-500"
            />
          </Link>

          <Link href={"#"}>
            <FontAwesomeIcon
              icon={faInstagram}
              size="lg"
              className="mr-3 text-[#E1306C]"
            />
          </Link>

          <Link href={"#"}>
            <FontAwesomeIcon icon={faXTwitter} size="lg" className="mr-3" />
          </Link>

          <Link href={"#"}>
            <FontAwesomeIcon
              icon={faYoutube}
              size="lg"
              className="text-red-500"
            />
          </Link>
        </div>
      </div>
      <div
        className={`flex flex-col items-center gap-6 justify-center mb-14 text-lg ${openSans.className} md:flex-row`}
      >
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          HOME
        </Link>
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          FORMS
        </Link>
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          Calendar
        </Link>
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          Privacy Policy
        </Link>
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          Terms And Conditions
        </Link>
        <Link className="text-[#49740B] hover:text-black" href={"#"}>
          GVE GALLERY
        </Link>
      </div>
    </div>
  )
}
