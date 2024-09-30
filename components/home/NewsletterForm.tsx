"use client"
import type { FormEvent } from "react"
import { useState, useEffect, useRef } from "react"
import { signUpForNewsletter } from "@/actions/user"
import ReCAPTCHA from "react-google-recaptcha"

export default function NewsletterForm() {
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
    const validEmail =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!formData.get("email")) {
      return setFormResponse({
        ...formResponse,
        error: "Error: email cannot be empty.",
      })
    }

    const email = String(formData.get("email"))

    if (!email.match(validEmail)) {
      return setFormResponse({
        ...formResponse,
        error: "Error: not a valid email.",
      })
    }

    if (email.length > 128) {
      return setFormResponse({
        ...formResponse,
        error: "Error: email must be 128 characters or less.",
      })
    }

    setFormButton({ text: "LOADING...", disabled: true })
    const response = await signUpForNewsletter(formData)
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
      className="ml-auto mr-auto w-full lg:w-fit"
      onSubmit={
        (e) =>
          e.preventDefault() /*(disabled until sendgrid activated) setProcessForm({ event: e, ready: true })*/
      }
      ref={form}
    >
      <input
        type="text"
        name="email"
        placeholder="Email address"
        className="box-border block h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent pl-3 outline-none focus:border-black lg:mr-6 lg:inline lg:w-[600px]"
        autoComplete="email"
        required
      />
      <input
        type="submit"
        value={formButton.text}
        className="h-[50px] w-full cursor-pointer bg-[#49740B] font-bold text-white hover:bg-lime-600 lg:w-[150px]"
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
