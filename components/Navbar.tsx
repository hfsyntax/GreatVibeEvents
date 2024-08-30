"use client"
import { useEffect, useState, useRef } from "react"
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
import { logout } from "@/lib/session"

export default function Navbar({
  navbar,
  openNavbar,
  closeNavbar,
  session,
}: {
  navbar: boolean
  openNavbar: () => void
  closeNavbar: () => void
  session: any
}) {
  const pathname = usePathname()
  const [search, showSearch] = useState(false)
  const [userDropdown, showUserDropdown] = useState(false)
  const userDropdownVisible = useRef(userDropdown)
  const searchBar = useRef<HTMLInputElement>(null)
  const toggleSearch = () => showSearch(!search)
  const handleUserDropDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.id === "loginLink" || target.id === "logoffLink") return
    if (target.id === "userIcon" || target?.parentElement?.id === "userIcon") {
      showUserDropdown(!userDropdownVisible.current)
    } else if (userDropdownVisible.current) {
      showUserDropdown(false)
    }
  }
  const handleLogout = async () => {
    await logout()
    showUserDropdown(false)
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleUserDropDown)
    return () => {
      document.removeEventListener("mousedown", handleUserDropDown)
    }
  }, [])
  useEffect(() => {
    userDropdownVisible.current = userDropdown
  }, [userDropdown])
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
        <Image
          src={"/img/logo.png"}
          priority
          alt="logo"
          width={200}
          height={200}
        />
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
            onClick={closeNavbar}
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
            onClick={closeNavbar}
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
            onClick={closeNavbar}
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
            onClick={closeNavbar}
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
            onClick={closeNavbar}
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
            onClick={closeNavbar}
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
          <Link
            href={"/#contact"}
            className="cursor-pointer hover:text-green-700"
            onClick={closeNavbar}
          >
            CONTACT
          </Link>
        </li>
      </ul>
      <div
        className={`relative flex ${navbar ? "flex-col mr-auto ml-16" : "flex-row ml-auto"} items-center xl:flex-row`}
      >
        <FontAwesomeIcon
          icon={faBars}
          size="lg"
          className={`p-2 text-[#49740B] hover:text-black cursor-pointer xl:!hidden ${navbar && "!hidden"}`}
          onClick={openNavbar}
        />
        <FontAwesomeIcon
          icon={search ? faX : faMagnifyingGlass}
          size="lg"
          className={`p-2 text-[#49740B] hover:text-black cursor-pointer !hidden xl:!inline`}
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
          className={`p-2 text-[#49740B] hover:text-black cursor-pointer ${navbar && "!hidden"} xl:!inline`}
        />
        <Link
          href={"/login"}
          className={`hidden ${pathname === "/login" && "font-bold"} ${navbar && `!inline text-black ${openSans.className} text-2xl hover:!text-green-700 mr-auto uppercase`}`}
          onClick={closeNavbar}
        >
          Login
        </Link>
        <FontAwesomeIcon
          id="userIcon"
          icon={faUser}
          size="lg"
          className={`p-2 text-[#49740B] hover:text-black cursor-pointer !hidden ${!navbar && "md:!inline-block"}`}
        />
        {userDropdown && (
          <ul
            id="userDropdown"
            className={`hidden ${!navbar && "md:inline-block"} absolute top-full w-full shadow-md bg-white p-4`}
          >
            {!session && (
              <Link href={"/login"} onClick={() => showUserDropdown(false)}>
                <li id="loginLink" className="text-[#49740B]">
                  Sign In
                </li>
              </Link>
            )}
            {session && (
              <li
                id="logoffLink"
                className="text-[#49740B] cursor-pointer"
                onClick={handleLogout}
              >
                Logoff
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  )
}
