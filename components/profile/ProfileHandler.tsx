"use client"
import type { FormEntry } from "@/types"
import type { FormEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faPen } from "@fortawesome/free-solid-svg-icons"
import { Open_Sans } from "next/font/google"
import { Session } from "@/types"
import { useState, useRef } from "react"
import { useCheckoutDataContext } from "@/context/CheckoutDataProvider"
import { updateSessionInfo } from "@/lib/session"
const openSans = Open_Sans({ subsets: ["latin"] })

export default function ProfileHandler({
  session,
  updated,
}: {
  session: Session
  updated: string | null
}) {
  const { eventForms } = useCheckoutDataContext()

  const [userInfo, setUserInfo] = useState({
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    number: session.user.number,
    address: session.user.address,
  })

  const initialUserInfo = useRef(userInfo)

  const [errors, setErrors] = useState<FormEntry | undefined>({})

  const validAddress =
    /^[a-zA-Z0-9\s]{1,217},\s[a-zA-Z0-9\s]{1,28},\s[a-zA-Z]{2}\s\d{5}$/i

  const handleInfoChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget
    const id = target.id
    const value = target.value
    if (id === "first" || id === "last") {
      if (id === "first") {
        setUserInfo({
          ...userInfo,
          firstName: value,
        })
      } else {
        setUserInfo({
          ...userInfo,
          lastName: value,
        })
      }

      if (!value) {
        if (errors && errors[id] && errors[id].includes("name cannot be empty"))
          return
        return setErrors({
          ...errors,
          [id]: `${id.charAt(0).toUpperCase()}${id.slice(1)} name cannot be empty.`,
        })
      } else if (value.includes(" ")) {
        if (
          errors &&
          errors[id] &&
          errors[id].includes("name cannot contain a space")
        )
          return
        return setErrors({
          ...errors,
          [id]: `${id.charAt(0).toUpperCase()}${id.slice(1)} name cannot contain a space.`,
        })
      } else if (value.length > 63) {
        if (
          errors &&
          errors[id] &&
          errors[id].includes("name cannot be longer than 63 characters")
        )
          return
        return setErrors({
          ...errors,
          [id]: `${id.charAt(0).toUpperCase()}${id.slice(1)} name cannot be longer than 63 characters.`,
        })
      }
    } else if (id === "number") {
      if (isNaN(Number(value))) return
      setUserInfo({
        ...userInfo,
        number: value,
      })
      if (value && (value.length > 20 || value.length < 3)) {
        if (errors && errors["number"]) return
        return setErrors({
          ...errors,
          number: "Phone number must be between 3-20 numbers.",
        })
      }
    } else if (id === "address") {
      setUserInfo({
        ...userInfo,
        address: value,
      })
      if (!value) {
        if (
          errors &&
          errors["address"] &&
          errors["address"].includes("Address cannot be empty")
        )
          return
        return setErrors({
          ...errors,
          address: "Address cannot be empty.",
        })
      }
      if (!value.match(validAddress)) {
        if (
          errors &&
          errors["address"] &&
          errors["address"].includes("Address must be")
        )
          return
        return setErrors({
          ...errors,
          address: "Address must be: STREET, CITY, STATE ABBREVIATION ZIP.",
        })
      }
    }
    const updatedErrors = { ...errors }

    if (errors && errors[target.id]) {
      delete updatedErrors[target.id]
    }

    const infoChanged =
      JSON.stringify(userInfo) !== JSON.stringify(initialUserInfo.current)

    if (infoChanged) {
      if (
        errors &&
        errors["updateInfo"] &&
        errors["updateInfo"].includes("until")
      ) {
        delete updatedErrors["updateInfo"]
      }
    }
    setErrors(updatedErrors)
  }

  const updateInfo = async () => {
    const infoChanged =
      JSON.stringify(userInfo) !== JSON.stringify(initialUserInfo.current)
    if (!infoChanged) {
      if (
        errors &&
        errors["updateInfo"] &&
        errors["updateInfo"].includes(
          "Cannot update info until user info is changed",
        )
      )
        return
      return setErrors({
        ...errors,
        updateInfo: "Cannot update info until user info is changed.",
      })
    }
    if (errors && Object.keys(errors).length > 0) {
      if (
        errors &&
        errors["updateInfo"] &&
        errors["updateInfo"].includes(
          "Cannot update info until input errors are fixed",
        )
      )
        return
      return setErrors({
        ...errors,
        updateInfo: "Cannot update info until input errors are fixed.",
      })
    }

    const updatedSession: Session = {
      ...session,
      user: {
        ...session.user,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        address: userInfo.address,
        number: userInfo.number,
      },
    }
    const response = await updateSessionInfo(updatedSession)
    if (!response) return
    // success
    if (Object.keys(response).length === 0) {
      initialUserInfo.current = userInfo
      return setErrors(undefined)
    }
    return setErrors(response)
  }

  return (
    <>
      <span className={`${openSans.className} ml-3 text-2xl xl:ml-0`}>
        My Profile
      </span>
      <span className="ml-3 text-sm xl:ml-0">
        Last Updated {updated ? updated : "Never"}
      </span>
      <div className="mt-6 flex w-full gap-2">
        <div className="ml-3 w-full xl:ml-0">
          <input
            type="text"
            placeholder="First Name"
            value={userInfo.firstName}
            onInput={handleInfoChange}
            maxLength={63}
            className={`h-[50px] w-full rounded bg-gray-200 pl-3 outline-none ${errors && errors["first"] && "box-border border border-red-500"}`}
            id="first"
          />
          {errors && errors["first"] && (
            <span className="text-red-500">{errors["first"]}</span>
          )}
        </div>
        <div className="mr-3 w-full xl:mr-0">
          <input
            type="text"
            placeholder="Last Name"
            value={userInfo.lastName}
            onInput={handleInfoChange}
            maxLength={63}
            className={`h-[50px] w-full rounded bg-gray-200 pl-3 outline-none ${errors && errors["last"] && "box-border border border-red-500"}`}
            id="last"
          />
          {errors && errors["last"] && (
            <span className="text-red-500">{errors["last"]}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex w-full flex-col gap-6 lg:flex-row lg:gap-2">
        <div className="w-full pl-3 pr-3 lg:pr-0 xl:pl-0">
          <input
            type="text"
            placeholder="Phone Number"
            value={userInfo.number}
            onInput={handleInfoChange}
            maxLength={20}
            className={`h-[50px] w-full rounded bg-gray-200 pl-3 outline-none ${errors && errors["number"] && "box-border border border-red-500"}`}
            id="number"
          />
          {errors && errors["number"] && (
            <span className="text-red-500">{errors["number"]}</span>
          )}
        </div>
        <div className="w-full pl-3 pr-3 lg:pl-0 xl:pr-0">
          <input
            type="text"
            placeholder="Address"
            value={userInfo.address}
            onInput={handleInfoChange}
            className={`h-[50px] w-full rounded bg-gray-200 pl-3 outline-none ${errors && errors["address"] && "box-border border border-red-500"}`}
            id="address"
          />
          {errors && errors["address"] && (
            <span className="text-red-500">{errors["address"]}</span>
          )}
        </div>
      </div>

      <button
        className="mr-3 mt-4 h-[30px] w-full bg-black text-white sm:w-[200px] xl:ml-0"
        onClick={updateInfo}
        type="button"
      >
        Update info
      </button>
      {errors && errors["updateInfo"] && (
        <span className="text-red-500">{errors["updateInfo"]}</span>
      )}
      {!errors && <span className="text-green-500">success</span>}
      <b className={`ml-3 mt-10 xl:ml-0 ${openSans.className} text-xl`}>
        Email Address
      </b>
      <div className="ml-3 mt-4 flex items-center gap-4 xl:ml-0">
        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-400">
          <FontAwesomeIcon icon={faEnvelope} size="lg" />
        </div>
        <span>{session.user.email}</span>
        <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-400">
          {eventForms > 0 && (
            <span className="absolute left-0 top-[-5px] rounded-full bg-red-500 pl-2 pr-2 text-white">
              {eventForms}
            </span>
          )}
          <FontAwesomeIcon icon={faPen} size="lg" />
        </div>
        <span>Event Forms</span>
      </div>
      <button
        className="ml-3 mt-4 h-[30px] w-[200px] bg-black text-white xl:ml-0"
        type="button"
      >
        Change email
      </button>
      <button
        className="ml-3 mt-4 h-[30px] w-[200px] bg-black text-white xl:ml-0"
        type="button"
      >
        Change password
      </button>
    </>
  )
}
