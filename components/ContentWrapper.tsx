"use client"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export default function ContentWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [navbar, showNavbar] = useState(false)
  const openNavbar = () => {
    showNavbar(true)
  }
  useEffect(() => {
    if (navbar) {
      window.scrollTo(0, 0)
    }
  }, [navbar])
  const closeNavbar = () => showNavbar(false)
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${navbar ? "overflow-hidden" : "overflow-auto"} xl:overflow-auto`}
      >
        <div className={`flex flex-col 2xl:flex-row`}>
          <div
            className={`bg-black border-yellow-500 border-2 box-border w-full h-[90px] 2xl:w-[160px] 2xl:h-auto`}
          >
            <span className="text-white">[ad container left]</span>
          </div>
          <div className="flex flex-col xl:w-[1232px] ml-auto mr-auto w-full">
            <div className="bg-black w-full hidden 2xl:inline-block h-[90px]">
              <span className="text-white">[ad container middle]</span>
            </div>
            <Navbar
              navbar={navbar}
              openNavbar={openNavbar}
              closeNavbar={closeNavbar}
            />
            {children}
            <Footer />
          </div>
          <div
            className={`bg-black box-border border-yellow-500 border-2 w-full h-[90px] 2xl:w-[160px] 2xl:h-auto`}
          >
            <span className="text-white">[ad container right]</span>
          </div>
        </div>
      </body>
    </html>
  )
}
