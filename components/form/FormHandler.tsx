"use client"
import type { FocusEvent, RefObject, FormEvent, ChangeEvent } from "react"
import type { FormEntry } from "@/types"
import { exactDate, isAdult } from "@/lib/utils"
import Image from "next/image"
import SignatureCanvas from "react-signature-canvas"
import ReCAPTCHA from "react-google-recaptcha"
import { useState, useRef, useEffect } from "react"
import { handleEventForm } from "@/actions/user"

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
  const currentForm = useRef<HTMLFormElement | null>(null)
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

  const validEmail =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  const validAddress =
    /^[a-zA-Z0-9\s]{1,217},\s[a-zA-Z0-9\s]{1,28},\s[a-zA-Z]{2}\s\d{5}$/i

  const checkFormInputs = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | FocusEvent<HTMLInputElement | HTMLSelectElement>
      | FormEvent<HTMLInputElement>,
  ) => {
    let { name, value } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      value = (e.target as HTMLInputElement).checked ? "yes" : ""
    }

    if (
      !value &&
      ![
        "participant-no-eaosh",
        "participant-yes-eaosh",
        "participant-no-r11r",
        "participant-yes-r11r",
        "participant-dols",
        "participant-no-uafd",
        "participant-yes-uafd",
        "participant-nka",
        "participant-latex",
        "participant-no-ctctmt",
        "participant-yes-ctctmt",
      ].includes(name)
    ) {
      if (errors[name] && errors[name].includes("is required")) return
      return setErrors({
        ...errors,
        [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} is required.`,
      })
    } else if (
      ["participant-name", "guardian-name", "emergency-contact"].includes(name)
    ) {
      const validFullName = /^(?=.{3,255}$)[a-zA-Z]+ [a-zA-Z]+$/
      if (!value.match(validFullName)) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} must be a full name of 255 characters or less.`,
        })
      }
    } else if (name === "participant-gender") {
      if (!["male", "female", "other"].includes(value)) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs["participant-gender"].current?.ariaDescription} must be Male, Female or Other`,
        })
      }
    } else if (name === "participant-birthday") {
      if (!isAdult(value.trim())) {
        if (errors[name] && errors[name].includes("is not")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs["participant-birthday"].current?.ariaDescription} is not at least 18 years old.`,
        })
      }
    } else if (
      ["participant-cell", "guardian-number", "emergency-number"].includes(name)
    ) {
      if (value.length < 3 || value.length > 20 || isNaN(parseInt(value))) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} must be between 3-20 numbers.`,
        })
      }
    } else if (
      ["participant-email", "guardian-email", "emergency-email"].includes(name)
    ) {
      if (!value.trim().match(validEmail)) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} must be a valid email.`,
        })
      }
    } else if (["participant-address", "guardian-address"].includes(name)) {
      if (!value.trim().match(validAddress)) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} must be: STREET, CITY, STATE ABBREVIATION ZIP`,
        })
      }
    } else if (
      ["participant-no-eaosh", "participant-yes-eaosh"].includes(name)
    ) {
      value =
        name === "participant-no-eaosh"
          ? value === "yes"
            ? "no"
            : checkboxes.current[0]?.checked
              ? "yes"
              : ""
          : value === "yes"
            ? "yes"
            : checkboxes.current[1]?.checked
              ? "no"
              : ""
      name = "participant-eaosh"
      const formErrors = { ...errors }
      if (!value) {
        if (formErrors["participant-dols"]) {
          delete formErrors["participant-dols"]
        }
        if (
          !formErrors[name] ||
          (formErrors[name] && !formErrors[name].includes("is required"))
        ) {
          formErrors[name] =
            `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} is required.`
        }
        return setErrors(formErrors)
      }

      if (value === "no" || value === "yes") {
        // delete both the participant-eaosh and participant-dols errors
        if (formErrors[name]) {
          delete formErrors[name]
        }
        if (value === "no" && errors["participant-dols"]) {
          delete formErrors["participant-dols"]
        }
        if (value === "yes" && !formValues["participant-dols"]) {
          formErrors["participant-dols"] =
            `${elementRefs["participant-eaosh"].current?.ariaDescription} is required`
        }
        setErrors(formErrors)
        return setFormValues({
          ...formValues,
          [name]: value,
          ["participant-dols"]:
            value === "no" ? "" : formValues["participant-dols"],
        })
      }
    } else if (name === "participant-dols") {
      if (formValues["participant-eaosh"] === "yes") {
        if (!value) {
          if (
            errors["participant-eaosh"] &&
            errors["participant-eaosh"].includes("is required")
          )
            return
          return setErrors({
            ...errors,
            [name]: `${elementRefs["participant-eaosh"].current?.ariaDescription} is required`,
          })
        } else if (exactDate(value.trim()) > new Date()) {
          if (
            errors["participant-eaosh"] &&
            errors["participant-eaosh"].includes("must be")
          )
            return
          return setErrors({
            ...errors,
            [name]: `${elementRefs["participant-dols"].current?.ariaDescription} must be today or earlier.`,
          })
        }
      }
    } else if (name === "participant-name-confirm") {
      if (!value) {
        if (errors[name] && errors[name].includes("is required.")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs["participant-name-confirm"].current?.ariaDescription} is required.`,
        })
      } else if (value.trim() !== formValues["participant-name"]) {
        if (errors[name] && errors[name].includes("must match")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs["participant-name-confirm"].current?.ariaDescription} must match the participant name.`,
        })
      }
    } else if (name === "guardian-name-confirm") {
      if (value.trim() !== formValues["guardian-name"]) {
        if (errors[name] && errors[name].includes("must match")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs["guardian-name-confirm"].current?.ariaDescription} must match Guardian First/Last Name.`,
        })
      }
    } else if (
      ["participant-date-signed", "guardian-date-signed"].includes(name) &&
      value
    ) {
      if (!value) {
        if (errors[name] && errors[name].includes("is required")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} is required.`,
        })
      } else if (
        new Date(value.trim()).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }) !== new Date().toLocaleDateString()
      ) {
        if (errors[name] && errors[name].includes("must be")) return
        return setErrors({
          ...errors,
          [name]: `${elementRefs[name as keyof ElementRefs].current?.ariaDescription} must be todays date.`,
        })
      }
    } else if (["participant-no-r11r", "participant-yes-r11r"].includes(name)) {
      if (
        (name === "participant-no-r11r" &&
          !value &&
          !checkboxes.current[2]?.checked) ||
        (name === "participant-yes-r11r" &&
          !value &&
          !checkboxes.current[3]?.checked)
      ) {
        return setErrors({
          ...errors,
          ["participant-r11r"]: `${elementRefs["participant-r11r"].current?.ariaDescription} is required.`,
        })
      }
      value =
        name === "participant-no-r11r"
          ? value === "yes"
            ? "no"
            : checkboxes.current[2]?.checked
              ? "yes"
              : ""
          : value === "yes"
            ? "yes"
            : checkboxes.current[3]?.checked
              ? "no"
              : ""
      name = "participant-r11r"
    } else if (["participant-no-uafd", "participant-yes-uafd"].includes(name)) {
      if (
        (name === "participant-no-uafd" &&
          !value &&
          !checkboxes.current[4]?.checked) ||
        (name === "participant-yes-uafd" &&
          !value &&
          !checkboxes.current[5]?.checked)
      ) {
        return setErrors({
          ...errors,
          ["participant-uafd"]: `${elementRefs["participant-address"].current?.ariaDescription} is required.`,
        })
      }
      value =
        name === "participant-no-uafd"
          ? value === "yes"
            ? "no"
            : checkboxes.current[4]?.checked
              ? "yes"
              : ""
          : value === "yes"
            ? "yes"
            : checkboxes.current[5]?.checked
              ? "no"
              : ""
      name = "participant-uafd"
    } else if (["participant-nka", "participant-latex"].includes(name)) {
      if (
        (name === "participant-nka" &&
          !value &&
          !checkboxes.current[9]?.checked) ||
        (name === "participant-latex" &&
          !value &&
          !checkboxes.current[8]?.checked)
      ) {
        return setErrors({
          ...errors,
          ["participant-allergies"]: `${elementRefs["participant-allergies"].current?.ariaDescription} is required.`,
        })
      }
      value =
        name === "participant-nka"
          ? value === "yes"
            ? "no"
            : checkboxes.current[9]?.checked
              ? "yes"
              : ""
          : value === "yes"
            ? "yes"
            : checkboxes.current[8]?.checked
              ? "no"
              : ""
      name = "participant-allergies"
    } else if (
      ["participant-no-ctctmt", "participant-yes-ctctmt"].includes(name)
    ) {
      if (
        (name === "participant-no-ctctmt" &&
          !value &&
          !checkboxes.current[6]?.checked) ||
        (name === "participant-yes-ctctmt" &&
          !value &&
          !checkboxes.current[7]?.checked)
      ) {
        return setErrors({
          ...errors,
          ["participant-ctctmt"]: `${elementRefs["participant-ctctmt"].current?.ariaDescription} is required`,
        })
      }
      value =
        name === "participant-no-ctctmt"
          ? value === "yes"
            ? "no"
            : checkboxes.current[6]?.checked
              ? "yes"
              : ""
          : value === "yes"
            ? "yes"
            : checkboxes.current[7]?.checked
              ? "no"
              : ""
      name = "participant-ctctmt"
    }

    // unset the error
    if (errors[name]) {
      const formErrors = { ...errors }
      delete formErrors[name]
      setErrors(formErrors)
    }

    // update form data
    return setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const handleValueFocus = (
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    checkFormInputs(e)
  }

  const handleValueChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | FormEvent<HTMLInputElement>,
  ) => {
    checkFormInputs(e)
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
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} ${["participant-cell", "guardian-number", "emergency-number"].includes(key) ? "must be 3-20 numbers." : "is required."}`
        }
      } else if (
        [
          "participant-food-allergies",
          "participant-special-dietary-needs",
          "guardian-name",
          "emergency-contact",
          "participant-name-confirm",
          "guardian-name-confirm",
          "participant-name",
          "guardian-address",
          "participant-address",
          "participant-bites-or-stings",
        ].includes(key) &&
        value.trim().length > 255
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 255 characters or less.`
      } else if (
        [
          "participant-other-disorders",
          "participant-medications",
          "participant-activity-interests",
          "participant-additional-enjoyment",
        ].includes(key) &&
        value.trim().length > 500
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 500 characters or less.`
      } else if (
        ["guardian-number", "emergency-number", "participant-number"].includes(
          key,
        ) &&
        (value.trim().length > 20 || isNaN(parseInt(value)))
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 20 numbers or less.`
      } else if (
        [
          "participant-eaosh",
          "participant-r11r",
          "participant-uafd",
          "participant-ctctmt",
        ].includes(key) &&
        value.trim().length > 3
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 3 characters or less.`
      } else if (
        [
          "participant-date-signed",
          "participant-dols",
          "guardian-date-signed",
          "participant-birthday",
        ].includes(key) &&
        (value.trim().length != 10 ||
          !(new Date(value.trim()) instanceof Date) ||
          isNaN(new Date(value.trim()).valueOf()))
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be a 10 character date.`
      } else if (
        ["emergency-email", "guardian-email", "participant-email"].includes(key)
      ) {
        if (!value.trim().match(validEmail)) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be a valid email.`
        } else if (value.trim().length > 255) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 255 characters or less.`
        }
      } else if (["participant-address", "guardian-address"].includes(key)) {
        if (!value.trim().match(validAddress)) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be: STREET, CITY, STATE ABBREVIATION ZIP`
        }
      } else if (key === "participant-dols") {
        if (exactDate(value.trim()) > new Date()) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be today or earlier.`
        }
      } else if (
        ["emergency-relationship", "guardian-relationship"].includes(key) &&
        value.trim().length > 64
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be 64 characters or less.`
      } else if (
        ["participant-signed", "guardian-signed"].includes(key) &&
        value.trim() !== "yes"
      ) {
        formErrors[key] =
          `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} must be yes.`
      } else if (
        key === "participant-allergies" &&
        !["latex", "no"].includes(value.trim())
      ) {
        formErrors[key] =
          `${elementRefs["participant-allergies"].current?.ariaDescription} must be either latex or no.`
      } else if (key === "participant-birthday") {
        if (!isAdult(value.trim())) {
          formErrors[key] =
            `${elementRefs[key as keyof ElementRefs].current?.ariaDescription} is not at least 18 years old.`
        }
      } else if (
        key === "participant-gender" &&
        !["male", "female", "other"].includes(value.trim())
      ) {
        formErrors[key] =
          `${elementRefs["participant-gender"].current?.ariaDescription} must be male, female or other.`
      } else if (key === "participant-name-confirm") {
        if (value.trim() !== formValues["participant-name"]) {
          formErrors[key] =
            `${elementRefs["participant-name-confirm"].current?.ariaDescription} must match Particpant First/Last Name.`
        }
      } else if (key === "guardian-name-confirm") {
        if (value.trim() !== formValues["guardian-name"]) {
          formErrors[key] =
            `${elementRefs["guardian-name-confirm"].current?.ariaDescription} must match Guardian First/Last Name.`
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
    if (Object.keys(response).length === 0) return setErrors({})
    setErrors(response)
  }

  useEffect(() => {
    if (errors["more"]) {
      currentForm.current?.reset()
      clearGuardianSignature()
      clearParticipantSignature()
    }
  }, [errors])

  return (
    <>
      <form className="mt-3" onSubmit={handleSubmit} ref={currentForm}>
        <b>Participant’s General Information:</b>
        <div className="mt-3 flex w-full flex-col items-center gap-4 lg:flex-row">
          <label className="mr-2 whitespace-nowrap">First/Last Name:</label>

          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="participant-name"
              placeholder="First/Last Name"
              className={`h-[50px] w-full border pl-3 outline-none lg:flex-1 ${errors["participant-name"] ? "border-red-500" : "border-gray-200"} box-border focus:${errors["participant-name"] ? "border-red-500" : "border-black"}`}
              autoComplete="name"
              required
              onInput={handleValueChange}
              onBlur={handleValueFocus}
              aria-description="Participant First/Last Name"
              maxLength={255}
              ref={elementRefs["participant-name"]}
            />
            {errors["participant-name"] && (
              <span className="block text-red-500">
                {errors["participant-name"]}
              </span>
            )}
          </div>
          <label className="ml-2 mr-2 whitespace-nowrap">Gender:</label>
          <div className="w-full lg:flex-1">
            <select
              name="participant-gender"
              className={`box-border h-[50px] w-full border outline-none lg:flex-1 ${errors["participant-gender"] ? "border-red-500 focus:border-red-500" : "focus:border-black"}`}
              defaultValue={"select-participant-gender"}
              aria-description="Participant Gender"
              required
              onChange={handleValueChange}
              onBlur={handleValueFocus}
              ref={elementRefs["participant-gender"]}
            >
              <option value="">Select Gender:</option>
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
              <option value={"other"}>Other</option>
            </select>
            {errors["participant-gender"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 lg:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Date of Birth(mm/dd/yyyy):
          </label>
          <div className="w-full lg:flex-1">
            <input
              type="date"
              name="participant-birthday"
              placeholder="Date of Birth(mm/dd/yyyy):"
              className={`h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-birthday"] ? "border-red-500 focus:border-red-500" : "focus:border-black"} box-border border-gray-200`}
              required
              onBlur={handleValueFocus}
              onChange={handleValueChange}
              aria-description="Participant Date of Birth"
              maxLength={10}
              ref={elementRefs["participant-birthday"]}
            />
            {errors["participant-birthday"] && (
              <span className="block text-red-500">
                {errors["participant-birthday"]}
              </span>
            )}
          </div>

          <label className="ml-2 mr-2 whitespace-nowrap">Cell #:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="participant-cell"
              placeholder="Cell #:"
              className={`h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-cell"] ? "border-red-500" : "border-gray-200 focus:border-black"} box-border`}
              autoComplete="tel"
              aria-description="Participant Cell #"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              ref={elementRefs["participant-cell"]}
              maxLength={20}
            />
            {errors["participant-cell"] && (
              <span className="block text-red-500">
                {errors["participant-cell"]}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 sm:flex-row">
          <label className="mr-2 whitespace-nowrap">Email:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="participant-email"
              placeholder=" Email:"
              className={`h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-email"] ? "border-red-500" : "border-gray-200 focus:border-black"} box-border`}
              autoComplete="email"
              aria-description="Participant Email"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              maxLength={255}
              ref={elementRefs["participant-email"]}
            />
            {errors["participant-email"] && (
              <span className="block text-red-500">
                {errors["participant-email"]}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 sm:flex-row">
          <label className="mr-2 whitespace-nowrap">Address:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="participant-address"
              placeholder="Address:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-address"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="street-address"
              aria-description="Participant address"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              maxLength={255}
              ref={elementRefs["participant-address"]}
            />
            {errors["participant-address"] && (
              <span className="block text-red-500">
                {errors["participant-address"]}
              </span>
            )}
          </div>
        </div>
        <b className="mt-3 block">Participant’s Health History</b>
        <div className="mt-3 flex w-full flex-wrap items-center gap-4">
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
        <div className="mt-3 flex w-full flex-col items-center gap-4 lg:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Other, please specify:
          </label>
          <input
            type="text"
            name="participant-other-disorders"
            placeholder="Other, please specify:"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            maxLength={500}
            onInput={handleValueChange}
          />
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 lg:flex-row">
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
              aria-description="Participant yes to Epilepsy and/or Seizure History"
              onChange={handleValueChange}
              ref={(element) => {
                checkboxes.current[0] = element
              }}
            />
            <label className="ml-2 mr-2 whitespace-nowrap">No</label>
            <input
              type="checkbox"
              name="participant-no-eaosh"
              aria-description="Participant no to Epilepsy and/or Seizure History"
              onChange={handleValueChange}
              ref={(element) => {
                checkboxes.current[1] = element
              }}
            />
            {errors["participant-eaosh"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
          <div className="flex w-full flex-col items-center sm:flex-row">
            <label className="mr-2 whitespace-nowrap">
              Date of last seizure:
            </label>
            <div className="w-full lg:flex-1">
              <input
                type="date"
                name="participant-dols"
                placeholder="Date of Birth(mm/dd/yyyy):"
                className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-dols"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
                aria-description="Participant date of last seizure"
                onBlur={handleValueFocus}
                onChange={handleValueChange}
                maxLength={10}
                ref={elementRefs["participant-dols"]}
              />
              {errors["participant-dols"] && (
                <span className="block text-red-500">
                  {errors["participant-dols"]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex w-full flex-wrap gap-4 md:items-center">
          <div>
            <label
              className="ml-2 mr-2 whitespace-nowrap"
              aria-description="Does the participant require 1:1 attendant ratio"
              ref={elementRefs["participant-r11r"]}
            >
              Does the participant require 1:1 attendant ratio?
            </label>
            {errors["participant-r11r"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
          <div>
            <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
            <input
              type="checkbox"
              name="participant-yes-r11r"
              aria-description="Participant yes to require 1:1 attendant ratio"
              onChange={handleValueChange}
              ref={(element) => {
                checkboxes.current[2] = element
              }}
            />
            <label className="ml-2 mr-2 whitespace-nowrap">No</label>
            <input
              type="checkbox"
              name="participant-no-r11r"
              aria-description="Participant no to require 1:1 attendant ratio"
              onChange={handleValueChange}
              ref={(element) => {
                checkboxes.current[3] = element
              }}
            />
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col gap-4 md:flex-row md:items-center">
          <div>
            <label className="ml-2 mr-2">
              Does the participant understand and follow directions?
            </label>
            {errors["participant-uafd"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
          <div>
            <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
            <input
              type="checkbox"
              name="participant-yes-uafd"
              aria-description="Participant yes to understand and follow directions"
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
              aria-description="Participant yes to understand and follow directions"
              onChange={handleValueChange}
              ref={(element) => {
                checkboxes.current[5] = element
              }}
            />
          </div>
        </div>
        <label
          className="mt-3 block font-bold"
          ref={elementRefs["participant-allergies"]}
          aria-description="Participant’s Allergies & Dietary Restrictions"
        >
          Participant’s Allergies & Dietary Restrictions
        </label>
        <div className="mt-3 flex w-full items-center gap-4">
          <label className="ml-2 mr-2 whitespace-nowrap">
            No Known Allergies
          </label>
          <input
            type="checkbox"
            name="participant-nka"
            aria-description="Participant no known allergies"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[8] = element
            }}
          />
          <label className="ml-2 mr-2 whitespace-nowrap">Latex</label>
          <input
            type="checkbox"
            name="participant-latex"
            aria-description="Participant latex"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[9] = element
            }}
          />
        </div>
        {errors["participant-allergies"] && (
          <span className="text-red-500">this field is required</span>
        )}
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Medications, please list:
          </label>
          <input
            type="text"
            name="participant-medications"
            placeholder="Medications, please list:"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            maxLength={500}
            onInput={handleValueChange}
          />
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Insect Bites or Stings(please describe)
          </label>
          <input
            type="text"
            name="participant-bites-or-stings"
            placeholder="Insect Bites or Stings(please describe)"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            onInput={handleValueChange}
          />
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Food Allergies:</label>
          <input
            type="text"
            name="participant-food-allergies"
            placeholder="Food Allergies:"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            maxLength={255}
            onInput={handleValueChange}
          />
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">
            List any special dietary needs:
          </label>
          <input
            type="text"
            name="participant-special-dietary-needs"
            placeholder="List any special dietary needs:"
            className="box-border h-[50px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            maxLength={255}
            onInput={handleValueChange}
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
        <div className="mt-3 flex w-full items-center gap-4">
          <label className="ml-2 mr-2 whitespace-nowrap">Yes</label>
          <input
            type="checkbox"
            name="participant-yes-ctctmt"
            aria-description="Participant capacity to consent to medical treatment"
            onChange={handleValueChange}
            ref={(element) => {
              checkboxes.current[6] = element
            }}
          />
          <label className="ml-2 mr-2 whitespace-nowrap">No</label>
          <input
            type="checkbox"
            name="participant-no-ctctmt"
            aria-description="Participant no capacity to consent to medical treatment"
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
        <div className="mt-3 flex w-full flex-col gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Please list all activities the participant enjoys:
          </label>
          <textarea
            name="participant-activity-interests"
            placeholder="Please list all activities the participant enjoys:"
            className="box-border h-[200px] w-full border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black lg:flex-1"
            maxLength={500}
            onChange={handleValueChange}
          />
        </div>
        <span className="mt-3 block">
          Please provide additional information to enhance participant's
          enjoyment and positive experience:
        </span>
        <div className="mt-3 flex w-full items-center gap-4">
          <textarea
            name="participant-additional-enjoyment"
            placeholder="Please provide additional information to enhance participant's enjoyment and positive experience:"
            className="box-border h-[200px] flex-1 border-[1px] border-b-gray-200 pl-3 outline-none focus:border-black"
            maxLength={500}
            onChange={handleValueChange}
          />
        </div>
        <div className="ml-auto mr-auto mt-3 flex w-fit flex-col items-center md:flex-row">
          <Image
            src={"/img/logo.png"}
            priority
            alt="logo"
            width={200}
            height={200}
          />
          <div>
            <b className="block w-full text-center">
              PARTICIPATION AND RELEASE FORM
            </b>
            <p className="ml-auto mr-auto w-full lg:w-[500px]">
              FORM MUST BE COMPLETED AND SIGNED BY ALL PARTIES PRIOR TO
              PARTICIPATING IN GREAT VIBE EVENTS ORGANIZED FUNCTIONS
            </p>
          </div>
        </div>
        <b className="block">Parent/Guardian General Information:</b>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">First & Last Name</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-name"
              placeholder="First & Last Name"
              autoComplete="name"
              className={`h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-name"] ? "border-red-500" : "border-gray-200 focus:border-black"} box-border`}
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Guardian First & Last Name"
              maxLength={255}
              ref={elementRefs["guardian-name"]}
            />
            {errors["guardian-name"] && (
              <span className="block text-red-500">
                {errors["guardian-name"]}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Relationship</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-relationship"
              placeholder="Relationship"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-relationship"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Guardian relationship"
              maxLength={64}
              ref={elementRefs["guardian-relationship"]}
            />
            {errors["guardian-relationship"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Cell #:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-number"
              placeholder="Cell #:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-number"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
              autoComplete="tel"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Guardian cell #"
              maxLength={20}
              ref={elementRefs["guardian-number"]}
            />
            {errors["guardian-number"] && (
              <span className="block text-red-500">
                {errors["guardian-number"]}
              </span>
            )}
          </div>
          <label className="ml-2 mr-2 whitespace-nowrap">Email</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-email"
              placeholder="Email"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-email"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="email"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Guardian email"
              maxLength={255}
              ref={elementRefs["guardian-email"]}
            />
            {errors["guardian-email"] && (
              <span className="block text-red-500">
                this field must be a valid email
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Address:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-address"
              placeholder="Address:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-address"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="street-address"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Guardian address"
              maxLength={255}
              ref={elementRefs["guardian-address"]}
            />
            {errors["guardian-address"] && (
              <span className="block text-red-500">
                {errors["guardian-address"]}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Emergency contact:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="emergency-contact"
              placeholder="Emergency contact:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["emergency-contact"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="name"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Emergency contact"
              maxLength={255}
              ref={elementRefs["emergency-contact"]}
            />
            {errors["emergency-contact"] && (
              <span className="block text-red-500">
                {errors["emergency-contact"]}
              </span>
            )}
          </div>
          <label className="mr-2 whitespace-nowrap">Relationship</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="emergency-relationship"
              placeholder="Realtionship"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["emergency-relationship"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="name"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Emergency relationship"
              maxLength={64}
              ref={elementRefs["emergency-relationship"]}
            />
            {errors["emergency-relationship"] && (
              <span className="block text-red-500">this field is required</span>
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Cell #:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="emergency-number"
              placeholder="Cell #:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["emergency-number"] ? "border-red-500" : "border-gray-200 focus:border-black"} `}
              autoComplete="tel"
              required
              aria-description="Emergency cell #"
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              maxLength={20}
              ref={elementRefs["emergency-number"]}
            />
            {errors["emergency-number"] && (
              <span className="block text-red-500">
                {errors["emergency-number"]}
              </span>
            )}
          </div>
          <label className="mr-2 whitespace-nowrap">Email:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="emergency-email"
              placeholder="Email:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["emergency-email"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="email"
              required
              aria-description="Emergency email"
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              maxLength={255}
              ref={elementRefs["emergency-email"]}
            />
            {errors["emergency-email"] && (
              <span className="block text-red-500">
                this field must be a valid email
              </span>
            )}
          </div>
        </div>
        <b className="mt-3 block">
          Participant and Guardian Release: I agree to the following:
        </b>
        <ol className="list-inside font-bold">
          <li className="ml-4 mt-1">
            Ability to Participate. I am physically able to take part in Great
            Vibe Events activities.
          </li>
          <li className="ml-4 mt-1">
            Likeness Release. I give permission to Great Vibe Events to use my
            likeness, photo, video, name, voice, words, and biographical
            information to promote Great Vibe Events and raise funds for Great
            Vibe Events mission.
          </li>
          <li className="ml-4 mt-1">
            Risk of Injury. I know there is a risk of injury and I understand
            the risk of continuing to participate in active physical activities.
          </li>
          <li className="ml-4 mt-1">
            Emergency Care. If I am unable, or my guardian is unavailable, to
            consent or make medical decisions in an emergency, I authorize Great
            Vibe Events to seek medical care on my behalf.
          </li>
          <li className="ml-4 mt-1">
            Personal Information: I understand that Great Vibe Events will be
            collecting my personal information as part of my participation
            including my name, image, address, telephone number. I agree and
            consent to Great Vibe Events using my contact information for
            communicating with me about Great Vibe Events
          </li>
        </ol>
        <p className="mt-3 block font-bold">
          In consideration of being allowed to participate in any way in Great
          Vibe Events, competition or fundraising activities, the undersigned
          acknowledges, appreciates, and agrees that:
        </p>
        <ol className="list-inside font-bold">
          <li className="mt-1">
            Participation includes possible exposure to and illness from
            infectious and/or communicable diseases including but not limited to
            MRSA, influenza, and COVID-19. While rules and personal discipline
            may reduce this risk, the risk of serious illness and death does
            exist; and,
          </li>
          <li className="mt-1">
            I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and
            unknown, EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASEES or
            others, and assume full responsibility for my participation; and,
          </li>
          <li className="mt-1">
            I willingly agree to comply with the stated and customary terms and
            conditions for participation as regards protection against
            infectious diseases. If, however, I observe and any unusual or
            significant hazard during my presence or participation, I will
            remove myself from participation and bring such to the attention of
            the nearest official immediately; and,
          </li>
          <li className="mt-1">
            I, for myself and on behalf of my heirs, assigns, personal
            representatives and next of kin, HEREBY RELEASE AND HOLD HARMLESS
            Great Vibe Events, their officers, officials, agents, and/or
            employees, other participants, sponsoring agencies, sponsors,
            advertisers, and if applicable, owners and lessors of premises used
            to conduct the event (“RELEASEES”), WITH RESPECT TO ANY AND ALL
            ILLNESS, DISABILITY, DEATH, or loss or damage to person or property,
            WHETHER ARISING FROM THE NEGLIGENCE OF RELEASEES OR OTHERWISE, to
            the fullest extent permitted by law.
          </li>
        </ol>
        <p className="mt-3 block font-bold">
          I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK
          AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP
          SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IF FREELY AND VOLUNTARILY
          WITHOUT ANY INDUCEMENT.
        </p>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">Name of participant:</label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="participant-name-confirm"
              placeholder="Name of participant:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["participant-name-confirm"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="name"
              required
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              aria-description="Name of participant before signature"
              maxLength={255}
              ref={elementRefs["participant-name-confirm"]}
            />
            {errors["participant-name-confirm"] && (
              <span className="block text-red-500">
                {errors["participant-name-confirm"]}
              </span>
            )}
          </div>
        </div>
        <b className="mt-2 block">Participant Signature</b>
        <div className="flex items-center gap-2 lg:justify-center">
          <div
            className="h-[100px] w-full select-none lg:w-[800px]"
            aria-description="Participant Signature"
            ref={elementRefs["participant-signature"]}
          >
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                className: `w-full h-3/4 border box-border ${errors["participant-signature"] ? "border-red-500" : "border-black"}`,
              }}
              onEnd={storeParticipantSignature}
              ref={participantCanvas}
            />
            {errors["participant-signature"] && (
              <span className="text-red-500">
                {errors["participant-signature"]}
              </span>
            )}
          </div>

          <button
            className="h-fit w-fit bg-black p-3 text-white"
            type="button"
            onClick={clearParticipantSignature}
          >
            reset
          </button>
        </div>

        <div className="mt-3 flex w-full items-center gap-4">
          <label className="mr-2 whitespace-nowrap">Date Signed</label>
          <div className="w-full flex-1">
            <input
              type="date"
              name="participant-date-signed"
              placeholder="Date of Birth(mm/dd/yyyy):"
              className={`box-border h-[50px] w-full flex-1 border-[1px] pl-3 outline-none ${errors["participant-date-signed"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              required
              aria-description="Paricipant date signed"
              onBlur={handleValueFocus}
              onChange={handleValueChange}
              maxLength={10}
              ref={elementRefs["participant-date-signed"]}
            />
            {errors["participant-date-signed"] && (
              <span className="block text-red-500">
                {errors["participant-date-signed"]}
              </span>
            )}
          </div>
        </div>
        <p className="mt-3 font-bold">
          This is to certify that I, as parent/guardian, with legal
          responsibility for this participant, have read and explained the
          provisions in this waiver/release to my child/ward including the risks
          of presence and participation and his/her personal responsibilities
          for adhering to the rules and regulations for protection against
          communicable diseases. Furthermore, my child/ward understands and
          accepts these risks and responsibilities. I for myself, my spouse, and
          child/ward do consent and agree to his/her release provided above for
          all the Releasees and myself, my spouse, and child/ward do release and
          agree to indemnify and hold harmless the Releasees for any and all
          liabilities incident to my minor child’s/ward’s presence or
          participation in these activities as provided above, EVEN IF ARISING
          FROM THEIR NEGLIGENCE, to the fullest extent provided by law.
        </p>
        <div className="mt-3 flex w-full flex-col items-center gap-4 md:flex-row">
          <label className="mr-2 whitespace-nowrap">
            Name of Parent/Guardian:
          </label>
          <div className="w-full lg:flex-1">
            <input
              type="text"
              name="guardian-name-confirm"
              placeholder="Name of Parent/Guardian:"
              className={`box-border h-[50px] w-full border-[1px] pl-3 outline-none lg:flex-1 ${errors["guardian-name-confirm"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              autoComplete="name"
              required
              aria-description="Name of guardian before signature"
              onBlur={handleValueFocus}
              onInput={handleValueChange}
              maxLength={255}
              ref={elementRefs["guardian-name-confirm"]}
            />
            {errors["guardian-name-confirm"] && (
              <span className="block text-red-500">
                {errors["guardian-name-confirm"]}
              </span>
            )}
          </div>
        </div>
        <b className="mt-2 block">Parent/Guardian Signature</b>
        <div className="flex items-center gap-2 lg:justify-center">
          <div
            className="h-[100px] w-full select-none lg:w-[800px]"
            aria-description="Parent/Guardian Signature"
            ref={elementRefs["guardian-signature"]}
          >
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                className: `w-full h-3/4 border box-border ${errors["guardian-signature"] ? "border-red-500" : "border-black"} `,
              }}
              onEnd={storeGuardianSignature}
              ref={guardianCanvas}
            />
            {errors["guardian-signature"] && (
              <span className="text-red-500">
                {errors["guardian-signature"]}
              </span>
            )}
          </div>
          <button
            className="h-fit w-fit bg-black p-3 text-white"
            type="button"
            onClick={clearGuardianSignature}
          >
            reset
          </button>
        </div>

        <div className="mt-3 flex w-full items-center gap-4">
          <label className="mr-2 whitespace-nowrap">Date Signed</label>
          <div className="w-full flex-1">
            <input
              type="date"
              name="guardian-date-signed"
              placeholder="Date of Birth(mm/dd/yyyy):"
              className={`box-border h-[50px] w-full flex-1 border-[1px] pl-3 outline-none ${errors["guardian-date-signed"] ? "border-red-500" : "border-gray-200 focus:border-black"}`}
              required
              aria-description="Guardian date signed"
              onBlur={handleValueFocus}
              onChange={handleValueChange}
              maxLength={10}
              ref={elementRefs["guardian-date-signed"]}
            />
            {errors["guardian-date-signed"] && (
              <span className="block text-red-500">
                {errors["guardian-date-signed"]}
              </span>
            )}
          </div>
        </div>
        <input
          type="submit"
          className="ml-auto mr-auto mt-3 block cursor-pointer bg-black p-3 text-white"
        />
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <ReCAPTCHA
            ref={recaptcha}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            size="invisible"
          />
        )}
      </form>
      {errors &&
        Object.values(errors).map((value, index) => (
          <span className="block text-red-500" key={`form_error_${index}`}>
            {value as string}
          </span>
        ))}
    </>
  )
}
