"use client"
import Link from "next/link"
import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperclip, faCircleXmark } from "@fortawesome/free-solid-svg-icons"

export default function ContactForm() {
  const [form, showForm] = useState(false)
  const toggleForm = () => {
    if (!form === false && fileCount !== 0) setFileCount(0)
    showForm(!form)
  }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileCount, setFileCount] = useState<number>(0)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0 && files.length !== fileCount) {
      setFileCount(files.length)
    }
  }

  return (
    <div
      className={`relative min-h-[550px] w-full overflow-hidden bg-[#fefefe]`}
      id="contact"
    >
      <div
        className={`box-border flex w-full flex-col items-center pl-10 pr-10 pt-10 transition-all duration-500 ease-in-out`}
      >
        <span
          className={`${form ? "lg:opacity-0" : "opacity-100"} relative mb-8 text-center text-lg text-[#161616]`}
        >
          CONTACT US
        </span>
        <span
          className={`${form ? "lg:opacity-0" : "opacity-100"} relative mb-6 text-center text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl`}
        >
          Inclusive Events for People with Special Abilities
        </span>
        <span
          className={`${form ? "lg:opacity-0" : "opacity-100"} relative mb-6 text-center text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl`}
        >
          Great Vibe Events
        </span>
        <span
          className={`${form ? "lg:opacity-0" : "opacity-100"} relative mb-6 text-center text-[28px] md:text-[30px] xl:text-[32px] 2xl:text-4xl`}
        >
          Call:&nbsp;
          <Link href="tel:7037746869" target="_blank">
            703-774-6869
          </Link>
        </span>
        <div
          className={`${form ? "border-none lg:opacity-0" : "cursor-pointer border border-black opacity-100 hover:bg-black"} group relative flex h-[56px] w-fit select-none items-center justify-center gap-2 pb-2 pl-4 pr-4 pt-2`}
          onClick={!form ? toggleForm : undefined}
        >
          <hr
            className={`w-4 ${!form && "border-black group-hover:border-white"}`}
          />
          <span
            className={`${!form ? "text-sm font-bold uppercase group-hover:text-white" : "text-xl"} text-center tracking-widest text-black 2xl:text-base`}
          >
            Drop Us an Email!
          </span>
          <hr
            className={`w-4 ${!form && "border-black group-hover:border-white"} `}
          />
        </div>
      </div>

      <form
        className={`${form ? "flex lg:left-1/2 lg:-translate-x-1/2 lg:opacity-100" : "hidden lg:-left-full lg:flex lg:opacity-0"} top-0 ml-auto mr-auto w-full flex-col gap-3 pb-5 transition-all duration-500 ease-in-out md:w-[600px] lg:absolute xl:w-[550px]`}
      >
        <span
          className={`${form && "lg:block"} hidden text-center text-xl tracking-widest text-black`}
        >
          Drop Us an Email!
        </span>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="mt-5 box-border h-[50px] border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
          autoComplete="name"
          required
        />
        <input
          type="text"
          name="email"
          placeholder="Email*"
          className="box-border h-[50px] border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
          autoComplete="email"
          required
        />
        <input
          type="text"
          name="info"
          placeholder="Where did you hear about us?"
          className="box-border h-[50px] w-full border-[1px] border-b-gray-200 border-l-transparent border-r-transparent border-t-transparent bg-transparent pl-3 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black lg:inline"
          required
        />
        <textarea
          placeholder="Tell us more about how you'd like to get involved."
          className="box-border h-[100px] w-full border-[1px] border-b-gray-200 bg-transparent pl-3 pt-4 text-[#767676] outline-none placeholder:text-[#5e5e5e] focus:border-black"
        />
        <span className={`text-center text-sm text-gray-500`}>
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </span>
        <div className="flex">
          <div
            className="cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FontAwesomeIcon icon={faPaperclip} size="lg" />
            <span className="ml-1">Attach Files</span>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="ml-auto">
            {fileCount > 0 && (
              <FontAwesomeIcon
                className="cursor-pointer"
                icon={faCircleXmark}
                size="lg"
                onClick={() => setFileCount(0)}
              />
            )}
            <span className="ml-1">Attatchments ({fileCount})</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center lg:flex-row lg:gap-3">
          <div className="group flex h-[56px] w-full cursor-pointer select-none items-center justify-center gap-2 border border-black pb-2 pl-4 pr-4 pt-2 transition-colors delay-[50ms] ease-out hover:bg-black lg:w-fit">
            <hr className={`w-4 border-black group-hover:border-white`} />
            <span
              className={`text-base font-bold uppercase tracking-widest text-black group-hover:text-white`}
            >
              Send
            </span>
            <hr className="w-4 border-black group-hover:border-white" />
          </div>
          <button
            type="button"
            className="mt-3 underline lg:mt-0"
            onClick={toggleForm}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
