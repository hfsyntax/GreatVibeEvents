"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })
import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
  faBars,
  faX,
} from "@fortawesome/free-solid-svg-icons"

export default function Navbar({
  navbar,
  openNavbar,
  closeNavbar,
}: {
  navbar: boolean
  openNavbar: () => void
  closeNavbar: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, showSearch] = useState(false)
  const searchBar = useRef<HTMLInputElement>(null)
  const loggedIn = false
  const toggleSearch = () => showSearch(!search)
  const handleContactClick = () => {
    router.push("/#contact")
    if (navbar) closeNavbar()
  }
  useEffect(() => {
    //closeNavbar()
  }, [pathname])
  useEffect(() => {
    if (search) {
      searchBar.current?.focus()
    }
  }, [search])
  return (
    <nav
      className={`z-10 select-none flex items-center mt-8 w-full ${navbar ? "bg-[#DAFFC0] flex-col fixed !top-0 !mt-0 h-full overflow-auto" : "bg-transparent flex-row top-auto"}  xl:h-fit xl:top-auto xl:!mt-8 xl:relative xl:flex xl:flex-row xl:bg-transparent xl:w-[1232px] ml-auto mr-auto`}
    >
      <Link
        href={"/"}
        className={`${navbar ? "hidden" : "inline-flex"} xl:inline-flex`}
      >
        <Image src={"/logo.png"} priority alt="logo" width={200} height={200} />
      </Link>
      {search && (
        <input
          type="text"
          placeholder="Search Products"
          className={`grow pl-3 ${navbar ? "hidden" : "inline-block"} xl:inline-block`}
          ref={searchBar}
          spellCheck={false}
        />
      )}
      <ul
        className={`${openSans.className} font-sans text-2xl ${navbar ? "flex flex-col w-full" : "hidden"} xl:text-lg xl:${search ? "hidden" : "flex"} xl:w-auto xl:flex-row`}
      >
        <FontAwesomeIcon
          icon={faX}
          size="lg"
          className={`ml-auto mr-3 mt-3 cursor-pointer hover:text-[#49740B] xl:!hidden`}
          onClick={closeNavbar}
        />
        <li
          className={`${navbar && "pb-6 mt-24"} pl-16 xl:pl-10 xl:mt-0 xl:pb-0`}
        >
          <Link
            href={"/"}
            className={
              pathname === "/"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            HOME
          </Link>
        </li>
        <li className={`pl-16 xl:pl-8 xl:pb-0 ${navbar && "pb-6"}`}>
          <Link
            href={"/events"}
            className={
              pathname === "/events"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700 "
            }
          >
            EVENTS
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pl-8 xl:pb-0`}>
          <Link
            href={"/shop"}
            className={
              pathname === "/shop"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700 "
            }
          >
            SHOP
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pl-8 xl:pb-0`}>
          <Link
            href={"/about"}
            className={
              pathname === "/about"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            ABOUT
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pl-8 xl:pb-0`}>
          <Link
            href={"/gallery"}
            className={
              pathname === "/gallery"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            GALLERY
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pl-8 xl:pb-0`}>
          <Link
            href={"/volunteer"}
            className={
              pathname === "/volunteer"
                ? "font-bold xl:font-normal xl:border-b-2 xl:border-black xl:box-border hover:text-green-700"
                : "hover:text-green-700"
            }
          >
            VOLUNTEER
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pl-8 xl:pb-0`}>
          <span
            className="cursor-pointer hover:text-green-700"
            onClick={handleContactClick}
          >
            CONTACT
          </span>
        </li>
      </ul>
      <div
        className={`flex ${navbar ? "flex-col mr-auto ml-16" : "flex-row ml-auto"} items-center xl:flex-row`}
      >
        <FontAwesomeIcon
          icon={faBars}
          size="lg"
          className={`p-2 text-green-700 hover:text-black cursor-pointer xl:!hidden ${navbar && "!hidden"}`}
          onClick={openNavbar}
        />
        <FontAwesomeIcon
          icon={search ? faX : faMagnifyingGlass}
          size="lg"
          className={`p-2 text-green-700 hover:text-black cursor-pointer !hidden xl:!inline`}
          onClick={toggleSearch}
        />
        {navbar && (
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="lg"
              className={`absolute top-5 ml-3 ${navbar ? "!block" : "!hidden"} xl:!hidden`}
            />
            <input
              type="text"
              placeholder="Search Products"
              className="xl:hidden relative mb-6 pt-4 pb-4 pl-10 pr-10 bg-[#FFFFFF26] outline-none border-[1px] border-transparent focus:border-black"
              spellCheck={false}
            ></input>
          </div>
        )}
        <FontAwesomeIcon
          icon={faCartShopping}
          size="lg"
          className={`p-2 text-green-700 hover:text-black cursor-pointer ${navbar && "!hidden"} xl:!inline`}
        />
        {!loggedIn ? (
          <Link
            href={"/login"}
            className={`${openSans.className} ${pathname === "/login" && "font-bold"} ${navbar && `!inline text-black ${openSans.className} text-2xl hover:!text-green-700 mr-auto uppercase`} ${!navbar && "md:inline md:!font-normal md:text-lg !text-green-700 hover:!text-black mr-3"} xl:mr-0 xl:!text-green-700 xl:!text-lg xl:!normal-case xl:!font-normal xl:hover:!text-black`}
          >
            Login
          </Link>
        ) : (
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            className="p-2 text-green-700 hover:text-black cursor-pointer !hidden md:!inline-block"
          />
        )}
      </div>
    </nav>
  )
}
