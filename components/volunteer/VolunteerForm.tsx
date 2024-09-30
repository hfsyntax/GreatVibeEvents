"use client"
import type { FormEvent } from "react"
import { useState, useEffect, useRef } from "react"
import { signUpVolunteer } from "@/actions/user"
import ReCAPTCHA from "react-google-recaptcha"
export default function VolunteerForm() {
  const form = useRef<HTMLFormElement>(null)
  const recaptcha = useRef<ReCAPTCHA>(null)
  const [processForm, setProcessForm] = useState<{
    ready: boolean
    event: FormEvent<HTMLFormElement> | null
  }>({ ready: false, event: null })
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

    if (!name.match(/^\S{1,63} \S{1,63}$/)) {
      return setFormResponse({
        message: "",
        error:
          "Error: Full name must include a space with less than 128 characters.",
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

  useEffect(() => {
    if (processForm.ready && processForm.event) {
      handleForm(processForm.event)
    }
  }, [processForm])

  return (
    <form
      className="mt-10 flex flex-col"
      ref={form}
      onSubmit={
        (e) =>
          e.preventDefault() /*(disabled until sendgrid activated) setProcessForm({ event: e, ready: true })*/
      }
    >
      <label>FULL NAME</label>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
        autoComplete="name"
        required
      />
      <label className="mt-3">ADDRESS</label>
      <input
        type="text"
        name="address"
        placeholder="Address"
        className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
        autoComplete="street-address"
        required
      />
      <label className="mt-3">PHONE NUMBER</label>
      <input
        type="text"
        name="number"
        placeholder="Phone Number"
        className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
        autoComplete="tel"
        required
      />
      <label className="mt-3">EMAIL</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black"
        autoComplete="email"
        required
      />
      <label className="mt-3">AVAILABILITY AND AREAS OF INTEREST</label>
      <textarea
        name="message"
        placeholder="Availability and areas of interest."
        className="mt-3 h-[100px] border border-b-gray-200 pl-3 outline-none focus:border-black"
        required
      ></textarea>
      <input
        type="submit"
        value={formButton.text}
        className="mt-3 cursor-pointer bg-[#49740B] p-3 text-white hover:bg-lime-600"
        disabled={formButton.disabled}
      />
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
        processForm.event &&
        processForm.ready && (
          <ReCAPTCHA
            ref={recaptcha}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            size="invisible"
          />
        )}
      {formResponse.error && (
        <span className="block text-red-500">{formResponse.error}</span>
      )}
      {formResponse.message && (
        <span className="block text-green-500">{formResponse.message}</span>
      )}
    </form>
  )
}
