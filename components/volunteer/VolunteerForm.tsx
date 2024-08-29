"use client"
import type { FormEvent } from "react"
import { useState, useEffect, useRef } from "react"
import { signUpVolunteer } from "@/actions/user"
import ReCAPTCHA from "react-google-recaptcha"
export default function VolunteerForm() {
  const form = useRef<HTMLFormElement>(null)
  const recaptcha = useRef<ReCAPTCHA>(null)
  const [formResponse, setFormResponse] = useState({ message: "", error: "" })
  const [formButton, setFormButton] = useState({
    text: "SIGN UP",
    disabled: false,
  })

  const handleForm = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    await recaptcha?.current?.executeAsync()
    const formElement = event.target as HTMLFormElement
    const formData = new FormData(formElement)

    const fields = ["name", "address", "number", "email", "message"]
    for (let field of fields) {
      if (!formData.get(field)) {
        return setFormResponse({
          error: `Error: ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
          message: "",
        })
      }
    }

    const name = String(formData.get("name"))

    if (!name.match(/^\S{1,127} \S{1,127}$/)) {
      return setFormResponse({
        message: "",
        error:
          "Error: Full name must include a space with 128 characters or less.",
      })
    }

    const address = String(formData.get("address"))

    if (address.length > 128) {
      return setFormResponse({
        message: "",
        error: "Error: Address is too long.",
      })
    }

    const number = String(formData.get("number"))

    if (!number.match(/^\d{7,20}$/)) {
      return setFormResponse({
        message: "",
        error: "Error: Phone number must be between 7-20 numbers.",
      })
    }

    const email = String(formData.get("email"))

    if (email.length > 128) {
      return setFormResponse({
        message: "",
        error: "Error: Email must be 128 characters or less.",
      })
    }

    const validEmail =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!email.match(validEmail)) {
      return setFormResponse({
        ...formResponse,
        error: "Error: not a valid email.",
      })
    }

    if (email.length > 128) {
      return setFormResponse({
        message: "",
        error: "Error: Email must be 128 characters or less.",
      })
    }

    const message = String(formData.get("message"))

    if (message.length > 512) {
      return { error: "Error: Message must be 512 characters or less." }
    }

    setFormButton({ text: "LOADING...", disabled: true })
    const response = await signUpVolunteer(formData)
    setFormResponse(response)
  }

  useEffect(() => {
    if (formResponse.message) {
      form.current?.reset()
    }
    if (formResponse.error || formResponse.message) {
      setFormButton({ text: "SIGN UP", disabled: false })
    }
  }, [formResponse])

  return (
    <form className="flex flex-col mt-10" ref={form} onSubmit={handleForm}>
      <label>FULL NAME</label>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
        autoComplete="name"
        required
      />
      <label className=" mt-3">ADDRESS</label>
      <input
        type="text"
        name="address"
        placeholder="Address"
        className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
        autoComplete="street-address"
        required
      />
      <label className="mt-3">PHONE NUMBER</label>
      <input
        type="text"
        name="number"
        placeholder="Phone Number"
        className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
        autoComplete="tel"
        required
      />
      <label className=" mt-3">EMAIL</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="w-full pl-3 h-[50px] outline-none border-[1px] border-t-transparent border-l-transparent border-r-transparent border-b-gray-200 box-border focus:border-black"
        autoComplete="email"
        required
      />
      <label className=" mt-3">AVAILABILITY AND AREAS OF INTEREST</label>
      <textarea
        name="message"
        placeholder="Availability and areas of interest."
        className=" pl-3 mt-3 outline-none border border-b-gray-200 h-[100px] focus:border-black"
        required
      ></textarea>
      <input
        type="submit"
        value={formButton.text}
        className="bg-[#49740B] p-3 mt-3 text-white cursor-pointer hover:bg-lime-600"
        disabled={formButton.disabled}
      />
      <ReCAPTCHA
        ref={recaptcha}
        sitekey="6Lc2eDEqAAAAAJmEYBpH6fnoNmRq46CnV6NSin3e"
        size="invisible"
      />
      {formResponse.error && (
        <span className="text-red-500 block">{formResponse.error}</span>
      )}
      {formResponse.message && (
        <span className="text-green-500 block">{formResponse.message}</span>
      )}
    </form>
  )
}
