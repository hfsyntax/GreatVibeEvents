"use client"
import type { KeyboardEvent } from "react"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { getCheckoutData, logout } from "@/lib/session"
import { getUserEventFormsCount } from "@/actions/server"
import { usePathname, useRouter } from "next/navigation"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"
import {
  faMagnifyingGlass,
  faCartShopping,
  faUser,
  faBars,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar({ session }: { session: any }) {
  const { data, setData, eventForms, setEventForms } = useCheckoutDataContext()
  const pathname = usePathname()
  const router = useRouter()
  const [search, showSearch] = useState(false)
  const [userDropdownVisible, setUserDropdownVisible] = useState(false)
  const [mobileNavbarVisible, setMobileNavbarVisible] = useState(false)
  const userDropdown = useRef<HTMLUListElement>(null)
  const searchBar = useRef<HTMLInputElement>(null)
  const mobileSearchBar = useRef<HTMLInputElement>(null)
  const userIcon = useRef<SVGSVGElement>(null)

  const toggleSearch = () => showSearch(!search)

  const handleUserDropDown = useCallback(
    (event: MouseEvent) => {
      const target = event.target
      if (
        target instanceof Node &&
        userDropdown.current &&
        !userDropdown.current.contains(target) &&
        userIcon.current &&
        !userIcon.current.contains(target)
      ) {
        setUserDropdownVisible(false)
      }
    },
    [userDropdown, userIcon, setUserDropdownVisible],
  )

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

    router.push("/login")
  }

  const handleSearch = (value?: string) => {
    if (value && value.length < 255) {
      router.push(`/shop?search=${value}`)
      if (pathname === "/shop") {
        if (search) showSearch(false)
        if (mobileNavbarVisible) setMobileNavbarVisible(false)
      }
    }
  }

  const closeElementsOnMainPage = () => {
    if (pathname === "/") {
      if (userDropdownVisible) setUserDropdownVisible(false)
      if (mobileNavbarVisible) setMobileNavbarVisible(false)
      if (search) showSearch(false)
    }
  }

  useEffect(() => {
    if (search && searchBar.current) {
      searchBar.current.focus()
    }
  }, [search])

  useEffect(() => {
    console.log(session)
  }, [])

  useEffect(() => {
    if (userDropdownVisible) {
      document.addEventListener("mousedown", handleUserDropDown)
    }

    if (session) {
      getCheckoutData().then((response) => {
        if (response && response.products.length !== data.totalProducts)
          setData((prevData) => ({
            ...prevData,
            totalProducts: response.products.length,
          }))
      })
      getUserEventFormsCount().then((response) => {
        if (response > 0) {
          setEventForms(response)
        }
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
      if (userDropdownVisible) {
        document.removeEventListener("mousedown", handleUserDropDown)
      }
    }
  }, [userDropdownVisible, handleUserDropDown])

  useEffect(() => {
    if (userDropdownVisible) setUserDropdownVisible(false)
    if (mobileNavbarVisible) setMobileNavbarVisible(false)
    if (search) showSearch(false)
  }, [pathname])

  return (
    <nav
      className={`z-10 ml-auto mr-auto mt-8 flex w-full select-none flex-row bg-transparent xl:flex-row`}
    >
      <Link href="/">
        <Image
          src={"/img/logo.png"}
          priority
          alt="logo"
          width={200}
          height={200}
        />
      </Link>
      <div
        className={`${mobileNavbarVisible && "mobile-navbar no-scrollbar fixed right-0 top-0 z-10 h-full w-[95%] overflow-auto bg-[#D8FAFA]"} flex flex-grow flex-col ${!mobileNavbarVisible && "pr-10"} lg:relative lg:left-auto lg:top-auto lg:h-auto lg:w-auto lg:overflow-hidden lg:bg-transparent lg:pr-10`}
      >
        <FontAwesomeIcon
          icon={faX}
          size="xl"
          className={`${mobileNavbarVisible ? "ml-auto mr-3 mt-3 !inline cursor-pointer hover:text-[#2f4f4f]" : "!hidden"} lg:!hidden`}
          onClick={() => setMobileNavbarVisible(false)}
        />
        <div
          className={`ml-auto ${mobileNavbarVisible && "mr-auto"} ${search ? "lg:ml-0" : "lg:ml-auto"} flex min-h-12 items-center gap-5 lg:relative lg:mr-0`}
        >
          {!search && (
            <>
              <Link
                href="https://www.facebook.com/188549064338074"
                target="_blank"
                className={`${mobileNavbarVisible ? "!inline" : "!hidden"} lg:!inline`}
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  size="lg"
                  className="text-[#1877F2]"
                />
              </Link>
              <Link
                href="https://www.instagram.com/greatvibeevent"
                target="_blank"
                className={`${mobileNavbarVisible ? "!inline" : "!hidden"} lg:!inline`}
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  size="lg"
                  className="text-[#E1306C]"
                />
              </Link>
              <Link
                href="https://www.x.com/greatvibeevents"
                target="_blank"
                className={`${mobileNavbarVisible ? "!inline" : "!hidden"} lg:!inline`}
              >
                <FontAwesomeIcon icon={faXTwitter} size="lg" />
              </Link>
              <Link
                href="https://www.youtube.com/@greatvibeevents"
                target="_blank"
                className={`${mobileNavbarVisible ? "!inline" : "!hidden"} lg:!inline`}
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  size="lg"
                  className="text-[#FF0000]"
                />
              </Link>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="lg"
                className="ml-4 !hidden text-[#2f4f4f] hover:cursor-pointer hover:text-black lg:!inline-flex"
                onClick={toggleSearch}
              />
            </>
          )}

          {search && (
            <>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="1x"
                className={`relative left-10 !hidden cursor-pointer text-[#2f4f4f] ${search && "lg:!inline"}`}
                onClick={() => handleSearch(searchBar.current?.value)}
              />
              <input
                type="text"
                placeholder="Search Products"
                className={`hidden ${search && "lg:inline"} box-border h-full flex-grow border border-[#2f4f4f] border-l-transparent border-r-transparent border-t-transparent pl-8 text-[#2f4f4f] outline-none placeholder:pb-2 placeholder:text-[#2f4f4f] focus:border-b-2 focus:border-[#2f4f4f]`}
                ref={searchBar}
                spellCheck={false}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === "Enter")
                    handleSearch(searchBar.current?.value)
                }}
              />
              <FontAwesomeIcon
                icon={faX}
                size="lg"
                className={`!hidden text-[#2f4f4f] hover:cursor-pointer hover:text-black ${search && "lg:!inline"}`}
                onClick={toggleSearch}
              />
            </>
          )}

          <Link
            href="/shop/cart"
            className={`${mobileNavbarVisible && "!hidden"} relative lg:inline-flex`}
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              size="lg"
              className="text-[#2f4f4f] hover:text-black"
            />
            {data.totalProducts > 0 && (
              <span className="absolute left-0 top-[-10px] rounded bg-red-500 pl-1 pr-1 text-xs text-white">
                {data.totalProducts}
              </span>
            )}
          </Link>

          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            ref={userIcon}
            className="!hidden text-[#2f4f4f] hover:cursor-pointer hover:text-black lg:!inline-flex"
            onClick={() => setUserDropdownVisible(!userDropdownVisible)}
          />
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            className={`${mobileNavbarVisible && "!hidden"} text-[#2f4f4f] hover:cursor-pointer hover:text-black lg:!hidden`}
            onClick={() => setMobileNavbarVisible(true)}
          />
          {userDropdownVisible && (
            <ul
              className={`absolute right-0 top-full w-[240px] bg-white p-4 text-lg shadow-md`}
              ref={userDropdown}
            >
              {session ? (
                <>
                  <Link href={"/profile"}>
                    <li className="text-[#2f4f4f]">profile</li>
                  </Link>
                  <li
                    className="cursor-pointer text-[#2f4f4f]"
                    onClick={handleLogout}
                  >
                    logoff
                  </li>
                </>
              ) : (
                <Link href="/login">
                  <li className="text-[#2f4f4f]">Sign In</li>
                </Link>
              )}
            </ul>
          )}
        </div>

        <ul
          className={`${mobileNavbarVisible ? "flex flex-col gap-6 text-2xl" : "hidden text-sm"} mt-4 tracking-[0.214em] lg:ml-auto lg:mr-auto lg:flex lg:h-full lg:flex-row lg:gap-8 lg:text-sm 2xl:text-base`}
        >
          <Link
            href={"/"}
            className={`${pathname === "/" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">home</li>
          </Link>
          <Link
            href="/events"
            className={`${pathname === "/events" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">events</li>
          </Link>
          <Link
            href="/shop"
            className={`${pathname === "/shop" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">shop</li>
          </Link>
          {mobileNavbarVisible && (
            <div className="relative ml-5 mr-5 lg:hidden">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="1x"
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-[#2f4f4f] ${mobileNavbarVisible ? "!inline" : "!hidden"} cursor-pointer lg:!hidden`}
                onClick={() => handleSearch(mobileSearchBar.current?.value)}
              />
              <input
                type="text"
                placeholder="Search Products"
                className={`${mobileNavbarVisible ? "inline" : "hidden"} box-border w-full border border-transparent bg-[#D8FAFA] pb-3 pl-10 pt-3 text-lg tracking-normal text-[#2f4f4f] outline-none placeholder:text-[#2f4f4f] focus:border-[#2f4f4f] lg:hidden`}
                ref={mobileSearchBar}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === "Enter")
                    handleSearch(mobileSearchBar.current?.value)
                }}
              />
            </div>
          )}

          <Link
            href="/about"
            className={`${pathname === "/about" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">about</li>
          </Link>
          <Link
            href="/gallery"
            className={`${pathname === "/gallery" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">gallery</li>
          </Link>
          <Link
            href="/volunteer"
            className={`${pathname === "/volunteer" && "font-bold lg:box-border lg:border lg:border-b-black lg:border-l-transparent lg:border-r-transparent lg:border-t-transparent lg:pb-1 lg:font-normal"} ${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
          >
            <li className="uppercase">volunteer</li>
          </Link>
          <Link
            href="/#contact"
            className={`${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:pl-0`}
            onClick={() => closeElementsOnMainPage()}
          >
            <li className="uppercase">contact</li>
          </Link>
          {mobileNavbarVisible && (
            <>
              <li
                className={`ml-10 mr-10 border-b border-b-gray-300 pb-1 text-base tracking-normal text-gray-500 lg:hidden`}
              >
                Account
              </li>

              {session ? (
                <>
                  <Link
                    href="/profile"
                    className={`${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#2f4f4f] lg:hidden`}
                  >
                    <li className="uppercase">profile</li>
                  </Link>
                  <li
                    className={`${mobileNavbarVisible && "inline pb-6 pl-10 uppercase hover:cursor-pointer hover:text-[#2f4f4f]"} lg:hidden`}
                  >
                    logoff
                  </li>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`${mobileNavbarVisible && "pl-10"} h-fit hover:text-[#49740B] lg:hidden`}
                >
                  <li className="uppercase">sign in</li>
                </Link>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
