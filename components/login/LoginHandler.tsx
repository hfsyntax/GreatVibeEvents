"use client"
import { useState } from "react"
import { Open_Sans } from "next/font/google"
const openSans = Open_Sans({ subsets: ["latin"] })

export default function LoginHandler() {
  const [visible, setVisible] = useState({
    login: true,
    register: false,
    forgot: false,
  })
  const showRegister = () =>
    setVisible({ login: false, register: true, forgot: false })
  const showLogin = () =>
    setVisible({ login: true, register: false, forgot: false })
  const showForgot = () =>
    setVisible({ login: false, register: false, forgot: true })
  return (
    <>
      {visible.login && (
        <>
          <span
            className={`text-[#49740B] text-lg ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            ACCOUNT SIGN IN
          </span>
          <form className="flex flex-col lg:w-[800px] ml-auto mr-auto">
            <span
              className={`text-gray-500 ${openSans.className} lg:text-lg text-center mb-6 block`}
            >
              Sign in to your account to access your profile, history, and any
              private pages you've been granted access to.
            </span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="password"
              required
            />
            <input
              type="submit"
              value={"SIGN IN"}
              className={`${openSans.className} text-base ml-auto mr-auto h-[56px] w-[150px] font-bold bg-[#49740B] pt-2 pb-2 pl-8 pr-8 mt-3 mb-6 text-white cursor-pointer hover:bg-lime-600`}
              disabled
            />
            <span
              className={`block text-[#49740B] text-lg ${openSans.className} ml-auto mr-auto w-fit cursor-pointer`}
              onClick={showForgot}
            >
              Reset password
            </span>
            <p className="text-gray-500 ml-auto mr-auto text-lg mt-10">
              Not a member?
              <span
                className="text-[#49740B] cursor-pointer"
                onClick={showRegister}
              >
                &nbsp;Create account
              </span>
              .
            </p>
          </form>
        </>
      )}
      {visible.register && (
        <>
          <span
            className={`text-[#49740B] text-lg ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            CREATE ACCOUNT
          </span>
          <form className="flex flex-col lg:w-[800px] ml-auto mr-auto">
            <span
              className={`text-gray-500 ${openSans.className} lg:text-lg text-center mb-6 block`}
            >
              By creating an account, you may receive newsletters or promotions.
            </span>
            <input
              type="text"
              name="first"
              placeholder="First Name"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="given-name"
              required
            />
            <input
              type="text"
              name="last"
              placeholder="Last Name"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="family-name"
              required
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="tel"
              required
            />
            <input
              type="submit"
              value={"CREATE ACCOUNT"}
              className={`${openSans.className} text-base ml-auto mr-auto h-[56px] w-[250px] font-bold bg-[#49740B] pt-2 pb-2 pl-8 pr-8 mt-3 mb-6 text-white cursor-pointer hover:bg-lime-600`}
              disabled
            />
            <p className="text-gray-500 ml-auto mr-auto text-lg">
              Don't need to reset your password?
              <span
                className="text-[#49740B] cursor-pointer"
                onClick={showLogin}
              >
                &nbsp;Sign in
              </span>
              .
            </p>
          </form>
        </>
      )}
      {visible.forgot && (
        <>
          <span
            className={`text-[#49740B] text-lg ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            RESET PASSWORD
          </span>
          <form className="flex flex-col lg:w-[800px] ml-auto mr-auto">
            <span
              className={`text-gray-500 ${openSans.className} lg:text-lg text-center mb-6 block`}
            >
              Enter your email address, and we’ll send you a password reset
              link.
            </span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="submit"
              value={"SEND RESET LINK"}
              className={`${openSans.className} text-base ml-auto mr-auto h-[56px] w-auto font-bold bg-[#49740B] pt-2 pb-2 pl-8 pr-8 mt-3 mb-6 text-white cursor-pointer hover:bg-lime-600`}
              disabled
            />
            <p className="text-gray-500 ml-auto mr-auto text-lg">
              Don't need to reset your password?
              <span
                className="text-[#49740B] cursor-pointer"
                onClick={showLogin}
              >
                &nbsp;Sign in
              </span>
              .
            </p>
          </form>
        </>
      )}
    </>
  )
}
