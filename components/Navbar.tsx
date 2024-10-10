"use client"
import type { KeyboardEvent } from "react"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
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
import { getCheckoutData, logout } from "@/lib/session"

export default function Navbar({ session }: { session: any }) {
  const { data, setData } = useCheckoutDataContext()
  const pathname = usePathname()
  const router = useRouter()
  const [navbar, showNavbar] = useState(false)
  const [search, showSearch] = useState(false)
  const [userDropdown, showUserDropdown] = useState(false)
  const userDropdownVisible = useRef(userDropdown)
  const searchBar = useRef<HTMLInputElement>(null)
  const mobileSearchBar = useRef<HTMLInputElement>(null)

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

  const openNavbar = () => {
    showNavbar(true)
  }

  const closeNavbar = () => {
    if (navbar) showNavbar(false)
  }

  const handleLogout = async () => {
    await logout()
    const guestCheckoutData = sessionStorage.getItem("shopData")
    const checkoutData = guestCheckoutData
      ? await getCheckoutData(guestCheckoutData)
      : null
    setData({
      ...data,
      totalProducts: checkoutData ? checkoutData.products.length : 0,
    })
    closeNavbar()
    showUserDropdown(false)
    router.push("/")
  }

  const handleSearchEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`/shop?search=${searchBar.current?.value}`)
      toggleSearch()
    }
  }

  const handleMobileSearchClick = () => {
    closeNavbar()
    router.push(`/shop?search=${mobileSearchBar.current?.value}`)
  }

  const handleMobileSearchEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      closeNavbar()
      router.push(`/shop?search=${mobileSearchBar.current?.value}`)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleUserDropDown)
    if (session) {
      getCheckoutData().then((response) => {
        if (response && response.products.length !== data.totalProducts)
          setData((prevData) => ({
            ...prevData,
            totalProducts: response.products.length,
          }))
      })
    } else {
      const guestCheckoutData = sessionStorage.getItem("shopData")
      if (guestCheckoutData) {
        getCheckoutData(guestCheckoutData).then((response) => {
          if (response && response.products.length !== data.totalProducts)
            setData((prevData) => ({
              ...prevData,
              totalProducts: response.products.length,
            }))
        })
      }
    }

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
      className={`z-10 mt-8 flex w-full select-none items-center ${navbar ? "mobile-navbar" : "top-auto flex-row bg-transparent"} ml-auto mr-auto xl:relative xl:top-auto xl:!mt-8 xl:flex xl:h-fit xl:w-[1232px] xl:flex-row xl:bg-transparent`}
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
          className={`hidden grow pl-3 xl:inline-block`}
          ref={searchBar}
          spellCheck={false}
          onKeyDown={handleSearchEnter}
        />
      )}
      <ul
        className={`${openSans.className} font-sans text-2xl ${navbar ? "flex w-full flex-col" : "hidden"} xl:text-lg xl:${search ? "hidden" : "flex"} xl:w-auto xl:flex-row`}
      >
        <FontAwesomeIcon
          icon={faX}
          size="lg"
          className={`ml-auto mr-3 mt-3 cursor-pointer hover:text-[#49740B] xl:!hidden`}
          onClick={closeNavbar}
        />
        <li
          className={`${navbar && "mt-24 pb-6"} pl-16 xl:mt-0 xl:pb-0 xl:pl-10`}
        >
          <Link
            href={"/"}
            onClick={closeNavbar}
            className={
              pathname === "/"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            HOME
          </Link>
        </li>
        <li className={`pl-16 xl:pb-0 xl:pl-8 ${navbar && "pb-6"}`}>
          <Link
            href={"/events"}
            onClick={closeNavbar}
            className={
              pathname === "/events"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            EVENTS
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pb-0 xl:pl-8`}>
          <Link
            href={"/shop"}
            onClick={closeNavbar}
            className={
              pathname === "/shop"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            SHOP
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pb-0 xl:pl-8`}>
          <Link
            href={"/about"}
            onClick={closeNavbar}
            className={
              pathname === "/about"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            ABOUT
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pb-0 xl:pl-8`}>
          <Link
            href={"/gallery"}
            onClick={closeNavbar}
            className={
              pathname === "/gallery"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            GALLERY
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pb-0 xl:pl-8`}>
          <Link
            href={"/volunteer"}
            onClick={closeNavbar}
            className={
              pathname === "/volunteer"
                ? "font-bold hover:text-green-700 xl:box-border xl:border-b-2 xl:border-black xl:font-normal"
                : "hover:text-green-700"
            }
          >
            VOLUNTEER
          </Link>
        </li>
        <li className={`pl-16 ${navbar && "pb-6"} xl:pb-0 xl:pl-8`}>
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
        className={`relative flex ${navbar ? "mobile-search-container ml-16 mr-auto flex-col xl:ml-auto xl:mr-0" : "ml-auto flex-row"} items-center xl:w-fit xl:flex-row`}
      >
        <FontAwesomeIcon
          icon={faBars}
          size="lg"
          className={`cursor-pointer p-2 text-[#49740B] hover:text-black xl:!hidden ${navbar && "!hidden"}`}
          onClick={openNavbar}
        />
        <FontAwesomeIcon
          icon={search ? faX : faMagnifyingGlass}
          size="lg"
          className={`!hidden cursor-pointer p-2 text-[#49740B] hover:text-black xl:!inline`}
          onClick={toggleSearch}
        />
        {navbar && (
          <div className="relative w-full">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="lg"
              className={`absolute top-5 ml-3 ${navbar ? "z-10 !block cursor-pointer" : "!hidden"} xl:!hidden`}
              onClick={handleMobileSearchClick}
            />
            <input
              type="text"
              placeholder="Search Products"
              className="relative mb-6 box-border w-full border-[1px] border-transparent bg-[#FFFFFF26] pb-4 pl-10 pr-10 pt-4 outline-none focus:border-black xl:hidden"
              spellCheck={false}
              onKeyDown={handleMobileSearchEnter}
              ref={mobileSearchBar}
            ></input>
          </div>
        )}
        <Link href={"/shop/cart"}>
          <div className="relative">
            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              className={`cursor-pointer p-2 text-[#49740B] hover:text-black ${navbar && "!hidden"} xl:!inline`}
            />
            {data.totalProducts > 0 && (
              <span className="absolute left-0 top-0 rounded bg-red-500 pl-1 pr-1 text-xs text-white">
                {data.totalProducts}
              </span>
            )}
          </div>
        </Link>

        {!session ? (
          <Link
            href={"/login"}
            className={`hidden ${pathname === "/login" && "font-bold"} ${navbar && `!inline text-black xl:!hidden ${openSans.className} mr-auto text-2xl uppercase hover:!text-green-700`}`}
            onClick={closeNavbar}
          >
            Login
          </Link>
        ) : (
          <span
            className={`hidden ${navbar && `!inline text-black xl:!hidden ${openSans.className} mr-auto cursor-pointer text-2xl uppercase hover:!text-green-700`}`}
            onClick={handleLogout}
          >
            logout
          </span>
        )}
        <FontAwesomeIcon
          id="userIcon"
          icon={faUser}
          size="lg"
          className={`cursor-pointer p-2 text-[#49740B] hover:text-black ${navbar ? "!hidden xl:!inline-block" : "!hidden md:!inline-block"}`}
        />
        {userDropdown && (
          <ul
            id="userDropdown"
            className={`hidden ${navbar ? "xl:inline-block" : "md:inline-block"} absolute top-full w-full bg-white p-4 shadow-md`}
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
                className="cursor-pointer text-[#49740B]"
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
