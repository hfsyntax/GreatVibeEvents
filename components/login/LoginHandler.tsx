"use client"
import type { FormEvent } from "react"
import { createAccount } from "@/actions/user"
import ReCAPTCHA from "react-google-recaptcha"
import { useState, useRef, useEffect } from "react"
import { Open_Sans } from "next/font/google"
import { login } from "@/lib/session"
const openSans = Open_Sans({ subsets: ["latin"] })

export default function LoginHandler() {
  const form = useRef<HTMLFormElement | null>(null)
  const recaptcha = useRef<ReCAPTCHA>(null)
  const [formResponse, setFormResponse] = useState({ message: "", error: "" })
  const [formDisabled, setFormDisabled] = useState(false)
  const [visible, setVisible] = useState({
    login: true,
    register: false,
    forgot: false,
  })
  const showRegister = () => {
    setFormResponse({ message: "", error: "" })
    setVisible({ login: false, register: true, forgot: false })
  }

  const showLogin = () => {
    setFormResponse({ message: "", error: "" })
    setVisible({ login: true, register: false, forgot: false })
  }

  const showForgot = () => {
    setFormResponse({ message: "", error: "" })
    setVisible({ login: false, register: false, forgot: true })
  }

  const handleLoginForm = async (event: FormEvent<HTMLFormElement>) => {
    if (visible.login) {
      event.preventDefault()
      await recaptcha?.current?.executeAsync()
      const formElement = event.target as HTMLFormElement
      const formData = new FormData(formElement)

      if (!formData.get("email") || !formData.get("password")) {
        return setFormResponse({
          error: "Error: email or password cannot be empty.",
          message: "",
        })
      }

      const email = String(formData.get("email"))
      const password = String(formData.get("password"))
      const validEmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

      if (!email.match(validEmail)) {
        return setFormResponse({
          error: "Error: not a valid email.",
          message: "",
        })
      }

      if (email.length > 128 || password.length > 128) {
        return setFormResponse({
          error: "incorrect username or password",
          message: "",
        })
      }

      setFormDisabled(true)
      const response = await login(formData)
      if (response && response.message) return
      return setFormResponse(response)
    }
  }

  const handleCreateForm = async (event: FormEvent<HTMLFormElement>) => {
    if (visible.register) {
      event?.preventDefault()
      await recaptcha?.current?.executeAsync()
      const formElement = event.target as HTMLFormElement
      const formData = new FormData(formElement)

      const fields = [
        "first",
        "last",
        "email",
        "address",
        "password",
        "password-repeat",
      ]
      for (let field of fields) {
        if (!formData.get(field)) {
          return setFormResponse({
            error: `Error: ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
            message: "",
          })
        }
      }

      const first = String(formData.get("first"))

      if (first.length > 63) {
        return setFormResponse({
          error: "Error: First name must be 63 characters or less.",
          message: "",
        })
      }

      const last = String(formData.get("last"))

      if (last.length > 63) {
        return setFormResponse({
          error: "Error: Last name must be 63 characters or less.",
          message: "",
        })
      }

      const email = String(formData.get("email"))

      const validEmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

      if (!email.match(validEmail)) {
        return setFormResponse({
          error: "Error: not a valid email.",
          message: "",
        })
      }

      if (email.length > 128) {
        return setFormResponse({
          error: "Error: Email must be 128 characters or less.",
          message: "",
        })
      }

      const address = String(formData.get("address"))
      const validAddress =
        /^[a-zA-Z0-9\s]{1,217},\s[a-zA-Z0-9\s]{1,28},\s[a-zA-Z]{2}\s\d{5}$/i

      if (!address.match(validAddress)) {
        return setFormResponse({
          error: "Error: Address must be: STREET, CITY, STATE ABBREVIATION ZIP",
          message: "",
        })
      }

      const number = String(formData.get("number"))

      if (formData.get("number") && !number.match(/^\d{8,20}$/)) {
        return setFormResponse({
          error: "Error: Phone number must be between 8-20 numbers.",
          message: "",
        })
      }

      const password = String(formData.get("password"))

      const validPassword = /^(?=.*[A-Z])(?=.*\d).{6,}$/

      if (!password.match(validPassword)) {
        return setFormResponse({
          error:
            "Error: password must contain at least 6 characters, 1 uppercase letter and 1 number",
          message: "",
        })
      }

      if (password.length > 128) {
        return setFormResponse({
          error: "Error: Password must be 128 characters or less.",
          message: "",
        })
      }

      const repeatPassword = String(formData.get("password-repeat"))

      if (password !== repeatPassword) {
        return setFormResponse({
          error: "Error: Passwords do not match.",
          message: "",
        })
      }
      setFormDisabled(true)
      const response = await createAccount(formData)
      setFormResponse(response)
    }
  }

  useEffect(() => {
    if (formResponse?.message) {
      form.current?.reset()
    }
    if (formResponse?.error || formResponse?.message) {
      setFormDisabled(false)
    }
  }, [formResponse])

  return (
    <>
      {visible.login && (
        <>
          <span
            className={`text-lg text-[#49740B] ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            ACCOUNT SIGN IN
          </span>
          <form
            className="ml-auto mr-auto flex flex-col lg:w-[800px]"
            onSubmit={handleLoginForm}
            ref={form}
          >
            <span
              className={`text-gray-500 ${openSans.className} mb-6 block text-center lg:text-lg`}
            >
              Sign in to your account to access your profile, history, and any
              private pages you've been granted access to.
            </span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="password"
              required
            />
            <input
              type="submit"
              value={formDisabled ? "LOADING..." : "SIGN IN"}
              className={`${openSans.className} mb-6 ml-auto mr-auto mt-3 h-[56px] w-[150px] cursor-pointer bg-[#49740B] pb-2 pl-8 pr-8 pt-2 text-base font-bold text-white hover:bg-lime-600`}
              disabled={formDisabled}
            />
            <span
              className={`block text-lg text-[#49740B] ${openSans.className} ml-auto mr-auto w-fit cursor-pointer`}
              onClick={showForgot}
            >
              Reset password
            </span>
            <p className="ml-auto mr-auto mt-10 text-lg text-gray-500">
              Not a member?
              <span
                className="cursor-pointer text-[#49740B]"
                onClick={showRegister}
              >
                &nbsp;Create account
              </span>
              .
            </p>
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size="invisible"
              />
            )}
            {formResponse?.error && (
              <span className="block text-red-500">{formResponse.error}</span>
            )}
          </form>
        </>
      )}
      {visible.register && (
        <>
          <span
            className={`text-lg text-[#49740B] ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            CREATE ACCOUNT
          </span>
          <form
            className="ml-auto mr-auto flex flex-col lg:w-[800px]"
            onSubmit={handleCreateForm}
            ref={form}
          >
            <span
              className={`text-gray-500 ${openSans.className} mb-6 block text-center lg:text-lg`}
            >
              By creating an account, you may receive newsletters or promotions.
            </span>
            <input
              type="text"
              name="first"
              placeholder="First Name"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="given-name"
              required
            />
            <input
              type="text"
              name="last"
              placeholder="Last Name"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="family-name"
              required
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="street-address"
              required
            />
            <input
              type="text"
              name="number"
              placeholder="Phone (optional)"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="tel"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="new-password"
              required
            />
            <input
              type="password"
              name="password-repeat"
              placeholder="Password repeat"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="new-password"
              required
            />
            <input
              type="submit"
              value={formDisabled ? "LOADING..." : "CREATE ACCOUNT"}
              className={`${openSans.className} mb-6 ml-auto mr-auto mt-3 h-[56px] w-[250px] cursor-pointer bg-[#49740B] pb-2 pl-8 pr-8 pt-2 text-base font-bold text-white hover:bg-lime-600`}
              disabled={formDisabled}
            />
            <p className="ml-auto mr-auto text-lg text-gray-500">
              Don't need to reset your password?
              <span
                className="cursor-pointer text-[#49740B]"
                onClick={showLogin}
              >
                &nbsp;Sign in
              </span>
              .
            </p>
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size="invisible"
              />
            )}
            {formResponse?.error && (
              <span className="block text-red-500">{formResponse.error}</span>
            )}
            {formResponse?.message && (
              <span className="block text-green-500">
                {formResponse.message}
              </span>
            )}
          </form>
        </>
      )}
      {visible.forgot && (
        <>
          <span
            className={`text-lg text-[#49740B] ${openSans.className} mb-8 ml-3 xl:ml-0`}
          >
            RESET PASSWORD
          </span>
          <form className="ml-auto mr-auto flex flex-col lg:w-[800px]">
            <span
              className={`text-gray-500 ${openSans.className} mb-6 block text-center lg:text-lg`}
            >
              Enter your email address, and we’ll send you a password reset
              link.
            </span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
              autoComplete="email"
              required
            />
            <input
              type="submit"
              value={"SEND RESET LINK"}
              className={`${openSans.className} mb-6 ml-auto mr-auto mt-3 h-[56px] w-auto cursor-pointer bg-[#49740B] pb-2 pl-8 pr-8 pt-2 text-base font-bold text-white hover:bg-lime-600`}
              disabled
            />
            <p className="ml-auto mr-auto text-lg text-gray-500">
              Don't need to reset your password?
              <span
                className="cursor-pointer text-[#49740B]"
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
