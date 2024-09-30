"use server"
import type { CheckoutData } from "@/types"
import { SignJWT, jwtVerify } from "jose"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sql } from "@vercel/postgres"
import { headers } from "next/headers"
import { validateRecaptcha } from "@/actions/user"

const secretKey = process.env.JWT_SECRET_KEY
const key = new TextEncoder().encode(secretKey)

async function encrypt(payload: any, time: string = "60d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(time)
    .sign(key)
}

async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    throw error
  }
}

async function insertLoginToken(token: string) {
  try {
    await sql`INSERT INTO checkout_tokens (token) VALUES (${token})`
  } catch (error) {
    throw error
  }
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const token = String(formData.get("g-recaptcha-response"))

  if (!email || !password) {
    return { error: "incorrect username or password", message: "" }
  }

  if (email.length > 128 || password.length > 128) {
    return { error: "incorrect username or password", message: "" }
  }

  if (!token) {
    return { error: "no reCAPTCHA token set.", message: "" }
  }

  const recaptchaValidated = await validateRecaptcha(token)

  if (!recaptchaValidated) {
    return { error: "reCAPTCHA validation failed", message: "" }
  }

  const dbUser =
    await sql`SELECT id, password, disabled, type, first, last, number, address FROM users WHERE email = ${email}`

  if (dbUser.rowCount === 1) {
    const hashedPassword = String(dbUser?.rows?.[0]?.["password"])
    const correctPassword = await compare(password, hashedPassword)
    if (correctPassword) {
      if (!dbUser?.rows?.[0]?.["disabled"]) {
        const userType = String(dbUser?.rows?.[0]?.["type"])
        const userId = Number(dbUser?.rows?.[0]?.["id"])
        const firstName = String(dbUser?.rows?.[0]?.["first"])
        const lastName = String(dbUser?.rows?.[0]?.["last"])
        const address = String(dbUser?.rows?.[0]?.["address"])
        const phoneNumber = dbUser?.rows?.[0]?.["number"]
          ? String(dbUser?.rows?.[0]?.["number"])
          : null
        const user = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
          type: userType,
          id: userId,
          number: phoneNumber,
          address: address,
        }
        const expires = new Date(Date.now() + 60 * 60 * 24 * 60 * 1000)
        const session = await encrypt({ user, expires })
        cookies().set("session", session, { expires, httpOnly: true })
        const headersList = headers()
        const referer = headersList.get("referer")
        if (referer) {
          const refererUrl = new URL(referer)
          const refererParams = refererUrl.searchParams
          const productId = refererParams.get("product_id")
          if (productId) {
            return redirect(`/checkout?product_id=${productId}`)
          }
        }
        return redirect("/")
      } else {
        return {
          error: "your account has been temporarily disabled",
          message: "",
        }
      }
    } else {
      return { error: "incorrect username or password", message: "" }
    }
  } else {
    return { error: "incorrect username or password", message: "" }
  }
}

export async function logout() {
  // Destroy the session
  cookies().delete("session")
  revalidatePath("/")
}

export async function getSession() {
  const session = cookies().get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value
    if (!session) {
      return
    }
    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + 60 * 60 * 24 * 60 * 1000)
    const res = NextResponse.next()
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    })
    return res
  } catch (error: any) {
    if (error?.name === "JWTExpired") {
      return NextResponse.redirect(new URL("/", request.url))
    } else {
      throw error
    }
  }
}

export async function storeCheckoutData(data: CheckoutData) {
  const encryptedShopData = await encrypt(data, "24h")
  const expires = new Date(Date.now() + 60 * 60 * 24 * 1000)
  cookies().set("shopData", encryptedShopData, { expires, httpOnly: true })
}

export async function getCheckoutData() {
  try {
    const encryptedShopData = cookies().get("shopData")?.value
    if (!encryptedShopData) return { products: [] }
    const decryptedData: CheckoutData = await decrypt(encryptedShopData)
    return decryptedData
  } catch (error) {
    console.error(error)
    return { products: [] }
  }
}

export async function deleteCheckoutData() {
  cookies().delete("shopData")
}
