import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

export default function Navbar() {
  return (
    <nav className="w-[1232px] ml-auto mr-auto mt-52 flex">
      <Image src={"/logo.png"} alt="logo" width={200} height={200} />
      <ul className="flex font-sans text-lg">
        <li className="pl-8 hover:text-green-700">
          <Link href={"/home"}>HOME</Link>
        </li>
        <li className="pl-8">
          <Link href={"/events"} className="hover:text-green-700">
            EVENTS
          </Link>
        </li>
        <li className="pl-8 ">
          <Link href={"/shop"} className="hover:text-green-700">
            SHOP
          </Link>
        </li>
        <li className="pl-8 ">
          <Link href={"/about"} className="hover:text-green-700">
            ABOUT
          </Link>
        </li>
        <li className="pl-8">
          <Link href={"/gallery"} className="hover:text-green-700">
            GALLERY
          </Link>
        </li>
        <li className="pl-8">
          <Link href={"/contact"} className="hover:text-green-700">
            CONTACT
          </Link>
        </li>
      </ul>
      <div className="ml-auto">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="lg"
          className="p-2 text-green-700 hover:text-black cursor-pointer"
        />
        <FontAwesomeIcon
          icon={faUser}
          size="lg"
          className="p-2 text-green-700 hover:text-black cursor-pointer"
        />

        <FontAwesomeIcon
          icon={faCartShopping}
          size="lg"
          className="p-2 text-green-700 hover:text-black cursor-pointer"
        />
      </div>
    </nav>
  )
}
