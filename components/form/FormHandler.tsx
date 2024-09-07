"use client"
import type { FocusEvent, RefObject } from "react"
import Image from "next/image"
import SignatureCanvas from "react-signature-canvas"
import ReCAPTCHA from "react-google-recaptcha"
import { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react"
import { handleEventForm } from "@/actions/user"

export type FormEntry = {
  [key: string]: string
}

type ElementRefs = {
  "participant-name": RefObject<HTMLInputElement>
  "participant-gender": RefObject<HTMLSelectElement>
  "participant-birthday": RefObject<HTMLInputElement>
  "participant-cell": RefObject<HTMLInputElement>
  "participant-email": RefObject<HTMLInputElement>
  "participant-address": RefObject<HTMLInputElement>
  "participant-eaosh": RefObject<HTMLLabelElement>
  "participant-dols": RefObject<HTMLInputElement>
  "participant-r11r": RefObject<HTMLLabelElement>
  "participant-uafd": RefObject<HTMLLabelElement>
  "participant-allergies": RefObject<HTMLLabelElement>
  "participant-ctctmt": RefObject<HTMLLabelElement>
  "guardian-name": RefObject<HTMLInputElement>
  "guardian-relationship": RefObject<HTMLInputElement>
  "guardian-number": RefObject<HTMLInputElement>
  "guardian-email": RefObject<HTMLInputElement>
  "guardian-address": RefObject<HTMLInputElement>
  "emergency-contact": RefObject<HTMLInputElement>
  "emergency-relationship": RefObject<HTMLInputElement>
  "emergency-number": RefObject<HTMLInputElement>
  "emergency-email": RefObject<HTMLInputElement>
  "participant-name-confirm": RefObject<HTMLInputElement>
  "participant-signature": RefObject<HTMLDivElement>
  "participant-date-signed": RefObject<HTMLInputElement>
  "guardian-name-confirm": RefObject<HTMLInputElement>
  "guardian-signature": RefObject<HTMLDivElement>
  "guardian-date-signed": RefObject<HTMLInputElement>
}

export default function FormHandler({
  paymentIntent,
}: {
  paymentIntent: string
}) {
  const [errors, setErrors] = useState<FormEntry>({})
  const elementRefs: ElementRefs = {
    "participant-name": useRef<HTMLInputElement | null>(null),
    "participant-gender": useRef<HTMLSelectElement | null>(null),
    "participant-birthday": useRef<HTMLInputElement | null>(null),
    "participant-cell": useRef<HTMLInputElement | null>(null),
    "participant-email": useRef<HTMLInputElement | null>(null),
    "participant-address": useRef<HTMLInputElement | null>(null),
    "participant-eaosh": useRef<HTMLLabelElement | null>(null),
    "participant-dols": useRef<HTMLInputElement | null>(null),
    "participant-r11r": useRef<HTMLLabelElement | null>(null),
    "participant-uafd": useRef<HTMLLabelElement | null>(null),
    "participant-allergies": useRef<HTMLLabelElement | null>(null),
    "participant-ctctmt": useRef<HTMLLabelElement | null>(null),
    "guardian-name": useRef<HTMLInputElement | null>(null),
    "guardian-relationship": useRef<HTMLInputElement | null>(null),
    "guardian-number": useRef<HTMLInputElement | null>(null),
    "guardian-email": useRef<HTMLInputElement | null>(null),
    "guardian-address": useRef<HTMLInputElement | null>(null),
    "emergency-contact": useRef<HTMLInputElement | null>(null),
    "emergency-relationship": useRef<HTMLInputElement | null>(null),
    "emergency-number": useRef<HTMLInputElement | null>(null),
    "emergency-email": useRef<HTMLInputElement | null>(null),
    "participant-name-confirm": useRef<HTMLInputElement | null>(null),
    "participant-signature": useRef<HTMLDivElement | null>(null),
    "participant-date-signed": useRef<HTMLInputElement | null>(null),
    "guardian-name-confirm": useRef<HTMLInputElement | null>(null),
    "guardian-signature": useRef<HTMLDivElement | null>(null),
    "guardian-date-signed": useRef<HTMLInputElement | null>(null),
  }
  const [formValues, setFormValues] = useState<FormEntry>({
    "participant-name": "",
    "participant-gender": "",
    "participant-birthday": "",
    "participant-cell": "",
    "participant-email": "",
    "participant-address": "",
    "participant-autism": "no",
    "participant-down-syndrome": "no",
    "participant-fragile-x-syndrome": "no",
    "participant-cerebral-palsy": "no",
    "participant-other-disorders": "no",
    "participant-eaosh": "",
    "participant-dols": "",
    "participant-r11r": "",
    "participant-uafd": "",
    "participant-allergies": "",
    "participant-medications": "no",
    "participant-bites-or-stings": "no",
    "participant-food-allergies": "no",
    "participant-special-dietary-needs": "no",
    "participant-ctctmt": "",
    "participant-activity-interests": "no",
    "participant-additional-enjoyment": "no",
    "guardian-name": "",
    "guardian-relationship": "",
    "guardian-number": "",
    "guardian-email": "",
    "guardian-address": "",
    "emergency-contact": "",
    "emergency-relationship": "",
    "emergency-number": "",
    "emergency-email": "",
    "participant-name-confirm": "",
    "participant-signature": "",
    "participant-date-signed": "",
    "guardian-name-confirm": "",
    "guardian-signature": "",
    "guardian-date-signed": "",
  })

  const checkboxes = useRef<Array<HTMLInputElement | null>>([])

  const handleValueFocus = (
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target

    if (name === "participant-dols") {
      if (!value && formValues["participant-eaosh"] === "yes") {
        setErrors({
          ...errors,
          [name]: String(
            elementRefs["participant-eaosh"].current?.ariaRoleDescription
          ),
        })
      } else {
        const currentErrors = { ...errors }
        if (currentErrors[name]) {
          delete currentErrors[name]
          setErrors(currentErrors)
        }
      }
    } else if (!value) {
      setErrors({
        ...errors,
        [name]: String(
          elementRefs[name as keyof ElementRefs].current?.ariaDescription
        ),
      })
    } else {
      const currentErrors = { ...errors }
      if (currentErrors[name]) {
        delete currentErrors[name]
        setErrors(currentErrors)
      }
    }
  }

  const handleValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target
    if (e.target.type === "checkbox") {
      value = (e.target as HTMLInputElement).checked ? "yes" : ""
    }

    if (name === "participant-no-eaosh") {
      if (!value && !checkboxes.current[0]?.checked) {
        setErrors({
          ...errors,
          ["participant-eaosh"]: String(
            elementRefs["participant-eaosh"].current?.ariaDescription
          ),
        })
      } else {
        const formErrors = { ...errors }
        if (errors["participant-eaosh"]) {
          delete formErrors["participant-eaosh"]
        }
        if (value) {
          delete formErrors["participant-dols"]
        }
        setErrors(formErrors)
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-eaosh"]:
          value === "yes" ? "no" : checkboxes.current[0]?.checked ? "yes" : "",
      }))
    }

    if (name === "participant-yes-eaosh") {
      const formErrors = { ...errors }
      if (!value && !checkboxes.current[1]?.checked) {
        if (!value) {
          delete formErrors["participant-dols"]
        }
        setErrors({
          ...formErrors,
          ["participant-eaosh"]: String(
            elementRefs["participant-eaosh"].current?.ariaDescription
          ),
        })
      } else {
        if (!value) {
          delete formErrors["participant-dols"]
        }
        if (errors["participant-eaosh"]) {
          delete formErrors["participant-eaosh"]
        }
        setErrors(formErrors)
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-eaosh"]:
          value === "yes" ? "yes" : checkboxes.current[1]?.checked ? "no" : "",
      }))
    }

    if (name === "participant-dols") {
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-eaosh"]: value ? "yes" : formValues["participant-eaosh"],
        [name]: value,
      }))
    }

    if (name === "participant-no-r11r") {
      if (!value && !checkboxes.current[2]?.checked) {
        setErrors({
          ...errors,
          ["participant-r11r"]: String(
            elementRefs["participant-r11r"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-r11r"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-r11r"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-r11r"]:
          value === "yes" ? "no" : checkboxes.current[2]?.checked ? "yes" : "",
      }))
    }

    if (name === "participant-yes-r11r") {
      if (!value && !checkboxes.current[3]?.checked) {
        setErrors({
          ...errors,
          ["participant-r11r"]: String(
            elementRefs["participant-r11r"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-r11r"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-r11r"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-r11r"]:
          value === "yes" ? "yes" : checkboxes.current[3]?.checked ? "no" : "",
      }))
    }

    if (name === "participant-no-uafd") {
      if (!value && !checkboxes.current[4]?.checked) {
        setErrors({
          ...errors,
          ["participant-uafd"]: String(
            elementRefs["participant-address"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-uafd"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-uafd"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-uafd"]:
          value === "yes" ? "no" : checkboxes.current[4]?.checked ? "yes" : "",
      }))
    }

    if (name === "participant-yes-uafd") {
      if (!value && !checkboxes.current[5]?.checked) {
        setErrors({
          ...errors,
          ["participant-uafd"]: String(
            elementRefs["participant-uafd"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-uafd"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-uafd"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-uafd"]:
          value === "yes" ? "yes" : checkboxes.current[5]?.checked ? "no" : "",
      }))
    }

    if (name === "participant-nka") {
      if (!value && !checkboxes.current[9]?.checked) {
        setErrors({
          ...errors,
          ["participant-allergies"]: String(
            elementRefs["participant-allergies"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-allergies"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-allergies"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-allergies"]:
          value === "yes" ? "no" : checkboxes.current[9]?.checked ? "yes" : "",
      }))
    }

    if (name === "participant-latex") {
      if (!value && !checkboxes.current[8]?.checked) {
        setErrors({
          ...errors,
          ["participant-allergies"]: String(
            elementRefs["participant-allergies"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-allergies"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-allergies"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-allergies"]:
          value === "yes" ? "yes" : checkboxes.current[8]?.checked ? "no" : "",
      }))
    }

    if (name === "participant-no-ctctmt") {
      if (!value && !checkboxes.current[6]?.checked) {
        setErrors({
          ...errors,
          ["participant-ctctmt"]: String(
            elementRefs["participant-ctctmt"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-ctctmt"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-ctctmt"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-ctctmt"]:
          value === "yes" ? "no" : checkboxes.current[6]?.checked ? "yes" : "",
      }))
    }

    if (name === "participant-yes-ctctmt") {
      if (!value && !checkboxes.current[7]?.checked) {
        setErrors({
          ...errors,
          ["participant-ctctmt"]: String(
            elementRefs["participant-ctctmt"].current?.ariaDescription
          ),
        })
      } else {
        if (errors["participant-ctctmt"]) {
          const formErrors = { ...errors }
          delete formErrors["participant-ctctmt"]
          setErrors(formErrors)
        }
      }
      return setFormValues((prevValues) => ({
        ...prevValues,
        ["participant-ctctmt"]:
          value === "yes" ? "yes" : checkboxes.current[7]?.checked ? "no" : "",
      }))
    }

    return setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const recaptcha = useRef<ReCAPTCHA>(null)
  const participantCanvas = useRef<SignatureCanvas>(null)
  const guardianCanvas = useRef<SignatureCanvas>(null)
  const clearParticipantSignature = () => {
    participantCanvas.current?.clear()
    return setFormValues({ ...formValues, ["participant-signature"]: "" })
  }
  const clearGuardianSignature = () => {
    guardianCanvas.current?.clear()
    return setFormValues({ ...formValues, ["guardian-signature"]: "" })
  }

  const storeParticipantSignature = () => {
    if (errors["participant-signature"]) {
      const formErrors = { ...errors }
      delete formErrors["participant-signature"]
      setErrors(formErrors)
    }
    return setFormValues({
      ...formValues,
      ["participant-signature"]: "yes",
    })
  }

  const storeGuardianSignature = () => {
    if (errors["guardian-signature"]) {
      const formErrors = { ...errors }
      delete formErrors["guardian-signature"]
      setErrors(formErrors)
    }
    return setFormValues({
      ...formValues,
      ["guardian-signature"]: "yes",
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formErrors = { ...errors }
    const token = await recaptcha?.current?.executeAsync()
    const formData = new FormData()
    if (token) formData.append("g-recaptcha-response", token)
    for (const [key, value] of Object.entries(formValues)) {
      if (!value.trim()) {
        if (
          (key === "participant-dols" &&
            formValues["participant-eaosh"] !== "yes") ||
          formErrors[key]
        ) {
          continue
        }
        if (elementRefs[key as keyof ElementRefs]) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} is required`
        }
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      const firstError = Object.keys(formErrors)[0]
      if (elementRefs[firstError as keyof ElementRefs]) {
        return elementRefs[
          firstError as keyof ElementRefs
        ].current?.scrollIntoView({ behavior: "smooth" })
      }
    }

    for (const key in formValues) {
      formData.append(key, formValues[key])
    }

    const response = await handleEventForm(formData, paymentIntent)
    if (Object.keys(response).length === 0) return
    setErrors(response)
  }

  return (
    <form className="mt-3" onSubmit={handleSubmit}>
      <b>Participant’s General Information:</b>
      <div className="flex flex-col lg:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">First/Last Name:</label>

        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="participant-name"
            placeholder="First/Last Name"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border ${errors["participant-name"] ? "border-red-500" : "border-gray-200"} box-border focus:${errors["participant-name"] ? "border-red-500" : "border-black"}`}
            autoComplete="name"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Participant First/Last Name"
            ref={elementRefs["participant-name"]}
          />
          {errors["participant-name"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <label className="ml-2 mr-2 whitespace-nowrap">Gender:</label>
        <div className="lg:flex-1 w-full">
          <select
            name="participant-gender"
            className={`lg:flex-1 w-full outline-none border box-border h-[50px] ${errors["participant-gender"] ? "border-red-500 focus:border-red-500" : "focus:border-black"}`}
            defaultValue={"select-participant-gender"}
            aria-describedby="Participant Gender"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["participant-gender"]}
          >
            <option value="">Select Gender:</option>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
            <option value={"other"}>Other</option>
          </select>
          {errors["participant-gender"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          Date of Birth(mm/dd/yyyy):
        </label>
        <div className="lg:flex-1 w-full">
          <input
            type="date"
            name="participant-birthday"
            placeholder="Date of Birth(mm/dd/yyyy):"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] ${errors["participant-birthday"] ? "border-red-500 focus:border-red-500" : "focus:border-black"} border-gray-200 box-border`}
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Participant Date of Birth"
            ref={elementRefs["participant-birthday"]}
          />
          {errors["participant-birthday"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>

        <label className="ml-2 mr-2 whitespace-nowrap">Cell #:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="participant-cell"
            placeholder="Cell #:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] ${errors["participant-cell"] ? "border-red-500" : "border-gray-200 focus:border-black"} box-border `}
            autoComplete="tel"
            aria-describedby="Participant Cell #"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["participant-cell"]}
          />
          {errors["participant-cell"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Email:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="participant-email"
            placeholder=" Email:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] ${errors["participant-email"] ? "border-red-500" : "border-gray-200 focus:border-black"}  box-border`}
            autoComplete="email"
            aria-describedby="Participant Email"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["participant-email"]}
          />
          {errors["participant-email"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Address:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="participant-address"
            placeholder="Address:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["participant-address"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="street-address"
            aria-describedby="Participant address"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["participant-address"]}
          />
          {errors["participant-address"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <b className="mt-3 block">Participant’s Health History</b>
      <div className="flex flex-wrap items-center w-full gap-4 mt-3">
        <label className="ml-2 mr-2 whitespace-nowrap">Autism</label>
        <input
          type="checkbox"
          name="participant-autism"
          onChange={handleValueChange}
        />
        <label className="ml-2 mr-2 whitespace-nowrap">Down Syndrome</label>
        <input
          type="checkbox"
          name="participant-down-syndrome"
          onChange={handleValueChange}
        />
        <label className="ml-2 mr-2 whitespace-nowrap">
          Fragile X Syndrome
        </label>
        <input
          type="checkbox"
          name="participant-fragile-x-syndrome"
          onChange={handleValueChange}
        />
        <label className="ml-2 mr-2 whitespace-nowrap">Cerebral Palsy</label>
        <input
          type="checkbox"
          name="participant-cerebral-palsy"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col lg:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Other, please specify:</label>
        <input
          type="text"
          name="participant-other-disorders"
          placeholder="Other, please specify:"
          className="lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col lg:flex-row  items-center w-full gap-4 mt-3">
        <div className="w-full">
          <label
            className="ml-2 mr-2 whitespace-nowrap"
            ref={elementRefs["participant-eaosh"]}
            aria-description="Epilepsy and/or Seizure History"
          >
            Epilepsy and/or Seizure History:
          </label>
          <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
          <input
            type="checkbox"
            name="participant-yes-eaosh"
            aria-describedby="Participant yes to Epilepsy and/or Seizure History"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[0] = element
            }}
          />
          <label className="ml-2 mr-2 whitespace-nowrap">No</label>
          <input
            type="checkbox"
            name="participant-no-eaosh"
            aria-describedby="Participant no to Epilepsy and/or Seizure History"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[1] = element
            }}
          />
          {errors["participant-eaosh"] && (
            <span className="block text-red-500">this field is required</span>
          )}
        </div>
        <div className="w-full flex flex-col sm:flex-row items-center">
          <label className="mr-2 whitespace-nowrap">
            Date of last seizure:
          </label>
          <div className="lg:flex-1 w-full">
            <input
              type="date"
              name="participant-dols"
              placeholder="Date of Birth(mm/dd/yyyy):"
              className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px]  box-border ${errors["participant-dols"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              aria-description="Participant date of last seizure"
              onBlur={handleValueFocus}
              onChange={handleValueChange}
              ref={elementRefs["participant-dols"]}
            />
            {errors["participant-dols"] && (
              <span className="text-red-500 block">this field is required</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap md:items-center w-full gap-4 mt-3">
        <div>
          <label
            className="ml-2 mr-2 whitespace-nowrap"
            aria-description="Does the participant require 1:1 attendant ratio"
            ref={elementRefs["participant-r11r"]}
          >
            Does the participant require 1:1 attendant ratio?
          </label>
          {errors["participant-r11r"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <div>
          <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
          <input
            type="checkbox"
            name="participant-yes-r11r"
            aria-describedby="Participant yes to require 1:1 attendant ratio"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[2] = element
            }}
          />
          <label className="ml-2 mr-2 whitespace-nowrap">No</label>
          <input
            type="checkbox"
            name="participant-no-r11r"
            aria-describedby="Participant no to require 1:1 attendant ratio"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[3] = element
            }}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center w-full gap-4 mt-3">
        <div>
          <label className="ml-2 mr-2">
            Does the participant understand and follow directions?
          </label>
          {errors["participant-uafd"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <div>
          <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
          <input
            type="checkbox"
            name="participant-yes-uafd"
            aria-describedby="Participant yes to understand and follow directions"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[4] = element
            }}
          />
          <label
            className="ml-2 mr-2 whitespace-nowrap"
            aria-description="Does the participant understand and follow directions"
            ref={elementRefs["participant-uafd"]}
          >
            No
          </label>
          <input
            type="checkbox"
            name="participant-no-uafd"
            aria-describedby="Participant yes to understand and follow directions"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[5] = element
            }}
          />
        </div>
      </div>
      <label
        className="block mt-3 font-bold"
        ref={elementRefs["participant-allergies"]}
        aria-description="Participant’s Allergies & Dietary Restrictions"
      >
        Participant’s Allergies & Dietary Restrictions
      </label>
      <div className="flex items-center w-full gap-4 mt-3">
        <label className="ml-2 mr-2 whitespace-nowrap">
          No Known Allergies
        </label>
        <input
          type="checkbox"
          name="participant-nka"
          aria-describedby="Participant no known allergies"
          onChange={handleValueChange}
          ref={(element) => {
            checkboxes.current[8] = element
          }}
        />
        <label className="ml-2 mr-2 whitespace-nowrap">Latex</label>
        <input
          type="checkbox"
          name="participant-latex"
          aria-describedby="Participant latex"
          onChange={handleValueChange}
          ref={(element) => {
            checkboxes.current[9] = element
          }}
        />
      </div>
      {errors["participant-allergies"] && (
        <span className="text-red-500">this field is required</span>
      )}
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          Medications, please list:
        </label>
        <input
          type="text"
          name="participant-medications"
          placeholder="Medications, please list:"
          className="lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          Insect Bites or Stings(please describe)
        </label>
        <input
          type="text"
          name="participant-bites-or-stings"
          placeholder="Insect Bites or Stings(please describe)"
          className="lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Food Allergies:</label>
        <input
          type="text"
          name="participant-food-allergies"
          placeholder="Food Allergies:"
          className="lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          List any special dietary needs:
        </label>
        <input
          type="text"
          name="participant-special-dietary-needs"
          placeholder="List any special dietary needs:"
          className="lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <b
        className="mt-3 block"
        ref={elementRefs["participant-ctctmt"]}
        aria-description="Consent to medical treatment
        on his or her behalf"
      >
        Does the participant have the capacity to consent to medical treatment
        on his or her behalf?
      </b>
      <div className="flex items-center w-full gap-4 mt-3">
        <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
        <input
          type="checkbox"
          name="participant-yes-ctctmt"
          aria-describedby="Participant capacity to consent to medical treatment"
          onChange={handleValueChange}
          ref={(element) => {
            checkboxes.current[6] = element
          }}
        />
        <label className="ml-2 mr-2 whitespace-nowrap">No</label>
        <input
          type="checkbox"
          name="participant-no-ctctmt"
          aria-describedby="Participant no capacity to consent to medical treatment"
          onChange={handleValueChange}
          ref={(element) => {
            checkboxes.current[7] = element
          }}
        />
      </div>
      {errors["participant-ctctmt"] && (
        <span className="text-red-500">this field is required</span>
      )}
      <b className="mt-3 block">Interest and Hobbies:</b>
      <div className="flex flex-col md:flex-row w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          Please list all activities the participant enjoys:
        </label>
        <textarea
          name="participant-activity-interests"
          placeholder="Please list all activities the participant enjoys:"
          className="lg:flex-1 w-full pl-3 h-[200px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <span className="block mt-3">
        Please provide additional information to enhance participant's enjoyment
        and positive experience:
      </span>
      <div className="flex items-center w-full gap-4 mt-3">
        <textarea
          name="participant-additional-enjoyment"
          placeholder="Please provide additional information to enhance participant's enjoyment and positive experience:"
          className="flex-1 pl-3 h-[200px] outline-none border-[1px] border-b-gray-200 box-border focus:border-black"
          onChange={handleValueChange}
        />
      </div>
      <div className="flex flex-col items-center md:flex-row mt-3 ml-auto mr-auto w-fit">
        <Image
          src={"/img/logo.png"}
          priority
          alt="logo"
          width={200}
          height={200}
        />
        <div>
          <b className="text-center w-full block">
            PARTICIPATION AND RELEASE FORM
          </b>
          <p className="w-full lg:w-[500px] ml-auto mr-auto">
            FORM MUST BE COMPLETED AND SIGNED BY ALL PARTIES PRIOR TO
            PARTICIPATING IN GREAT VIBE EVENTS ORGANIZED FUNCTIONS
          </p>
        </div>
      </div>
      <b className="block">Parent/Guardian General Information:</b>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">First & Last Name</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-name"
            placeholder="First & Last Name"
            autoComplete="name"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] ${errors["guardian-name"] ? "border-red-500" : "border-gray-200 focus:border-black"} box-border `}
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Guardian First & Last Name"
            ref={elementRefs["guardian-name"]}
          />
          {errors["guardian-name"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Relationship</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-relationship"
            placeholder="Relationship"
            className={`lg:flex-1 w-full  pl-3 h-[50px] outline-none border-[1px] box-border ${errors["guardian-relationship"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Guardian relationship"
            ref={elementRefs["guardian-relationship"]}
          />
          {errors["guardian-relationship"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Cell #:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-number"
            placeholder="Cell #:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["guardian-number"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
            autoComplete="tel"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Guardian cell #"
            ref={elementRefs["guardian-number"]}
          />
          {errors["guardian-number"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <label className="ml-2 mr-2 whitespace-nowrap">Email</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-email"
            placeholder="Email"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px]  box-border ${errors["guardian-email"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="email"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Guardian email"
            ref={elementRefs["guardian-email"]}
          />
          {errors["guardian-email"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Address:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-address"
            placeholder="Address:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px]  box-border ${errors["guardian-address"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="street-address"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Guardian address"
            ref={elementRefs["guardian-address"]}
          />
          {errors["guardian-address"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Emergency contact:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="emergency-contact"
            placeholder="Emergency contact:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px]  box-border ${errors["emergency-contact"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="name"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Emergency contact"
            ref={elementRefs["emergency-contact"]}
          />
          {errors["emergency-contact"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <label className="mr-2 whitespace-nowrap">Relationship</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="emergency-relationship"
            placeholder="Realtionship"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["emergency-relationship"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Emergency relationship"
            ref={elementRefs["emergency-relationship"]}
          />
          {errors["emergency-relationship"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Cell #:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="emergency-number"
            placeholder="Cell #:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["emergency-number"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
            autoComplete="tel"
            required
            aria-describedby="Emergency cell #"
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["emergency-number"]}
          />
          {errors["emergency-number"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
        <label className="mr-2 whitespace-nowrap">Email:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="emergency-email"
            placeholder="Email:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["emergency-email"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="email"
            required
            aria-describedby="Emergency email"
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["emergency-email"]}
          />
          {errors["emergency-email"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <b className="block mt-3">
        Participant and Guardian Release: I agree to the following:
      </b>
      <ol className="list-inside font-bold">
        <li className="mt-1 ml-4">
          Ability to Participate. I am physically able to take part in Great
          Vibe Events activities.
        </li>
        <li className="mt-1 ml-4">
          Likeness Release. I give permission to Great Vibe Events to use my
          likeness, photo, video, name, voice, words, and biographical
          information to promote Great Vibe Events and raise funds for Great
          Vibe Events mission.
        </li>
        <li className="mt-1 ml-4">
          Risk of Injury. I know there is a risk of injury and I understand the
          risk of continuing to participate in active physical activities.
        </li>
        <li className="mt-1 ml-4">
          Emergency Care. If I am unable, or my guardian is unavailable, to
          consent or make medical decisions in an emergency, I authorize Great
          Vibe Events to seek medical care on my behalf.
        </li>
        <li className="mt-1 ml-4">
          Personal Information: I understand that Great Vibe Events will be
          collecting my personal information as part of my participation
          including my name, image, address, telephone number. I agree and
          consent to Great Vibe Events using my contact information for
          communicating with me about Great Vibe Events
        </li>
      </ol>
      <p className="mt-3 font-bold block">
        In consideration of being allowed to participate in any way in Great
        Vibe Events, competition or fundraising activities, the undersigned
        acknowledges, appreciates, and agrees that:
      </p>
      <ol className="font-bold list-inside">
        <li className="mt-1">
          Participation includes possible exposure to and illness from
          infectious and/or communicable diseases including but not limited to
          MRSA, influenza, and COVID-19. While rules and personal discipline may
          reduce this risk, the risk of serious illness and death does exist;
          and,
        </li>
        <li className="mt-1">
          I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown,
          EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES or others, and
          assume full responsibility for my participation; and,
        </li>
        <li className="mt-1">
          I willingly agree to comply with the stated and customary terms and
          conditions for participation as regards protection against infectious
          diseases. If, however, I observe and any unusual or significant hazard
          during my presence or participation, I will remove myself from
          participation and bring such to the attention of the nearest official
          immediately; and,
        </li>
        <li className="mt-1">
          I, for myself and on behalf of my heirs, assigns, personal
          representatives and next of kin, HEREBY RELEASE AND HOLD HARMLESS
          Great Vibe Events, their officers, officials, agents, and/or
          employees, other participants, sponsoring agencies, sponsors,
          advertisers, and if applicable, owners and lessors of premises used to
          conduct the event (“RELEASEES”), WITH RESPECT TO ANY AND ALL ILLNESS,
          DISABILITY, DEATH, or loss or damage to person or property, WHETHER
          ARISING FROM THE NEGLIGENCE OF RELEASEES OR OTHERWISE, to the fullest
          extent permitted by law.
        </li>
      </ol>
      <p className="mt-3 font-bold block">
        I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT,
        FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL
        RIGHTS BY SIGNING IT, AND SIGN IF FREELY AND VOLUNTARILY WITHOUT ANY
        INDUCEMENT.
      </p>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Name of participant:</label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="participant-name-confirm"
            placeholder="Name of participant:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["participant-name-confirm"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="name"
            required
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            aria-describedby="Name of participant before signature"
            ref={elementRefs["participant-name-confirm"]}
          />
          {errors["participant-name-confirm"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <b className="mt-2 block">Participant Signature</b>
      <div className="flex gap-2 items-center lg:justify-center">
        <div
          className="w-full h-[100px] lg:w-[800px] select-none"
          aria-description="Participant Signature"
          ref={elementRefs["participant-signature"]}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              className: "w-full h-3/4 border box-border border-black",
            }}
            onEnd={storeParticipantSignature}
            ref={participantCanvas}
          />
          {errors["participant-signature"] && (
            <span className="text-red-500">this field is required</span>
          )}
        </div>

        <button
          className="bg-black text-white p-3 h-fit w-fit"
          type="button"
          onClick={clearParticipantSignature}
        >
          reset
        </button>
      </div>

      <div className="flex items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Date Signed</label>
        <div className="flex-1 w-full">
          <input
            type="date"
            name="participant-date-signed"
            placeholder="Date of Birth(mm/dd/yyyy):"
            className={`flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["participant-date-signed"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            required
            aria-describedby="Paricipant date signed"
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["participant-date-signed"]}
          />
          {errors["participant-date-signed"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <p className="mt-3 font-bold">
        This is to certify that I, as parent/guardian, with legal responsibility
        for this participant, have read and explained the provisions in this
        waiver/release to my child/ward including the risks of presence and
        participation and his/her personal responsibilities for adhering to the
        rules and regulations for protection against communicable diseases.
        Furthermore, my child/ward understands and accepts these risks and
        responsibilities. I for myself, my spouse, and child/ward do consent and
        agree to his/her release provided above for all the Releasees and
        myself, my spouse, and child/ward do release and agree to indemnify and
        hold harmless the Releasees for any and all liabilities incident to my
        minor child’s/ward’s presence or participation in these activities as
        provided above, EVEN IF ARISING FROM THEIR NEGLIGENCE, to the fullest
        extent provided by law.
      </p>
      <div className="flex flex-col md:flex-row items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">
          Name of Parent/Guardian:
        </label>
        <div className="lg:flex-1 w-full">
          <input
            type="text"
            name="guardian-name-confirm"
            placeholder="Name of Parent/Guardian:"
            className={`lg:flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["guardian-name-confirm"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            autoComplete="name"
            required
            aria-describedby="Name of guardian before signature"
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["guardian-name-confirm"]}
          />
          {errors["guardian-name-confirm"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <b className="block mt-2">Parent/Guardian Signature</b>
      <div className="flex gap-2 items-center lg:justify-center">
        <div
          className="w-full h-[100px] lg:w-[800px] select-none"
          aria-description="Parent/Guardian Signature"
          ref={elementRefs["guardian-signature"]}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              className: "w-full h-3/4 border box-border border-black",
            }}
            onEnd={storeGuardianSignature}
            ref={guardianCanvas}
          />
          {errors["participant-signature"] && (
            <span className="text-red-500">this field is required</span>
          )}
        </div>
        <button
          className="bg-black text-white p-3 h-fit w-fit"
          type="button"
          onClick={clearGuardianSignature}
        >
          reset
        </button>
      </div>

      <div className="flex items-center w-full gap-4 mt-3">
        <label className="mr-2 whitespace-nowrap">Date Signed</label>
        <div className="flex-1 w-full">
          <input
            type="date"
            name="guardian-date-signed"
            placeholder="Date of Birth(mm/dd/yyyy):"
            className={`flex-1 w-full pl-3 h-[50px] outline-none border-[1px] box-border ${errors["guardian-date-signed"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
            required
            aria-describedby="Guardian date signed"
            onBlur={handleValueFocus}
            onChange={handleValueChange}
            ref={elementRefs["guardian-date-signed"]}
          />
          {errors["guardian-date-signed"] && (
            <span className="text-red-500 block">this field is required</span>
          )}
        </div>
      </div>
      <input
        type="submit"
        className="bg-black text-white p-3 block ml-auto mr-auto mt-3 cursor-pointer"
      />
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <ReCAPTCHA
          ref={recaptcha}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}
      {errors &&
        Object.values(errors).map((value, index) => (
          <span className="text-red-500 block" key={`form_error_${index}`}>
            {value as string}
          </span>
        ))}
    </form>
  )
}
