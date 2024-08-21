"use client"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="w-[1232px] ml-auto mr-auto mt-52 flex">
      <Link href={"/"}>
        <Image src={"/logo.png"} priority alt="logo" width={200} height={200} />
      </Link>
      <ul className="flex font-sans text-lg">
        <li className="pl-24">
          <Link
            href={"/"}
            className={
              pathname === "/"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            HOME
          </Link>
        </li>
        <li className="pl-8">
          <Link
            href={"/events"}
            className={
              pathname === "/events"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            EVENTS
          </Link>
        </li>
        <li className="pl-8">
          <Link
            href={"/shop"}
            className={
              pathname === "/shop"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            SHOP
          </Link>
        </li>
        <li className="pl-8 ">
          <Link
            href={"/about"}
            className={
              pathname === "/about"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            ABOUT
          </Link>
        </li>
        <li className="pl-8">
          <Link
            href={"/gallery"}
            className={
              pathname === "/gallery"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            GALLERY
          </Link>
        </li>
        <li className="pl-8">
          <Link
            href={"/contact"}
            className={
              pathname === "/contact"
                ? "border-b-2 border-black box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
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
