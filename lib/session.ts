"use server"
import type { CheckoutData, FormEntry, Session } from "@/types"
import { SignJWT, jwtVerify } from "jose"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sql } from "@vercel/postgres"
import { validateRecaptcha } from "@/actions/user"

const secretKey = process.env.JWT_SECRET_KEY
const key = new TextEncoder().encode(secretKey)

async function encrypt(payload: any, time: string = "60d") {
  const session = await getSession()
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()

  if (session) {
    jwt.setExpirationTime(time)
  }

  return await jwt.sign(key)
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

export async function login(
  formData: FormData,
): Promise<{ error?: string; message?: string; userId?: number }> {
  // Verify credentials && get the user
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const token = String(formData.get("g-recaptcha-response"))

  if (!email || !password) {
    return { error: "incorrect username or password" }
  }

  if (email.length > 128 || password.length > 128) {
    return { error: "incorrect username or password" }
  }

  if (!token) {
    return { error: "no reCAPTCHA token set." }
  }

  const recaptchaValidated = await validateRecaptcha(token)

  if (!recaptchaValidated) {
    return { error: "reCAPTCHA validation failed" }
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
        // update checkout data cookie expiry
        const checkoutData = await getCheckoutData()
        if (checkoutData) await storeCheckoutData(checkoutData)
        return {
          message: "Success",
          userId: user.id,
        }
      } else {
        return {
          error: "your account has been temporarily disabled",
        }
      }
    } else {
      return { error: "incorrect username or password" }
    }
  } else {
    return { error: "incorrect username or password" }
  }
}

export async function logout() {
  // Destroy the session
  cookies().delete("session")
  revalidatePath("/")
}

export async function getSession(): Promise<Session | null> {
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
    const parsed: Session = await decrypt(session)
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

export async function updateSessionInfo(
  newSession: Session,
): Promise<FormEntry | undefined> {
  try {
    const errors: FormEntry = {}
    if (!newSession.user.firstName)
      errors["first"] = "First name cannot be empty."
    if (!newSession.user.lastName) errors["last"] = "Last name cannot be empty."
    if (!newSession.user.address) errors["address"] = "Address cannot be empty."
    if (newSession.user.firstName.includes(" ")) {
      errors["first"] = "First name cannot contain a space."
    }
    if (newSession.user.firstName.length > 63) {
      errors["first"] = "First name cannot be longer than 63 characters."
    }
    if (newSession.user.lastName.includes(" ")) {
      errors["last"] = "Last name cannot contain a space."
    }
    if (newSession.user.lastName.length > 63) {
      errors["last"] = "Last name cannot be longer than 63 characters"
    }
    if (
      newSession.user.number &&
      (newSession.user.number.length > 20 || newSession.user.number.length < 3)
    ) {
      errors["number"] = "Phone number must be between 3-20 numbers."
    }
    const validAddress =
      /^[a-zA-Z0-9\s]{1,217},\s[a-zA-Z0-9\s]{1,28},\s[a-zA-Z]{2}\s\d{5}$/i
    if (!newSession.user.address.match(validAddress)) {
      errors["address"] =
        "Address must be: STREET, CITY, STATE ABBREVIATION ZIP."
    }
    if (errors && Object.keys(errors).length > 0) {
      return errors
    }
    const currentSession = await getSession()
    if (!currentSession) return { noSession: "Error: no session" }
    const expires = new Date(Date.now() + 60 * 60 * 24 * 60 * 1000)
    const user = {
      email: currentSession.user.email,
      firstName: newSession.user.firstName,
      lastName: newSession.user.lastName,
      password: currentSession.user.password,
      type: currentSession.user.type,
      id: currentSession.user.id,
      number: newSession.user.number,
      address: newSession.user.address,
    }
    const updatedSession = await encrypt({ user, expires })
    cookies().set("session", updatedSession, { expires, httpOnly: true })
    await sql`UPDATE users 
    SET first = ${newSession.user.firstName},
    last = ${newSession.user.lastName},
    number = ${newSession.user.number},
    address = ${newSession.user.address},
    updated_at = ${new Date().toISOString()}
    WHERE id = ${currentSession.user.id}`
    return {}
  } catch (error: any) {
    if (error?.name === "JWTExpired") {
      revalidatePath("/")
      return redirect("/")
    } else {
      console.error(error)
      return { updateSession: "Internal server error." }
    }
  }
}

/**
 * Temporarily store the event ticket if the user is not logged in
 */
export async function encryptEventTicket(data: CheckoutData) {
  const encryptedShopData = await encrypt(data)
  return encryptedShopData
}

export async function getEventTicket(encryptedData: string) {
  try {
    const decryptedData: CheckoutData = await decrypt(encryptedData)
    return decryptedData
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function storeCheckoutData(data: CheckoutData) {
  const session = await getSession()
  if (session) {
    const encryptedShopData = await encrypt(data, "90d")
    const expires = new Date(Date.now() + 60 * 60 * 24 * 90 * 1000)
    cookies().set(`shopData_${session.user.id}`, encryptedShopData, {
      expires,
      httpOnly: true,
    })
    return encryptedShopData
  } else {
    const encryptedShopData = await encrypt(data)
    return encryptedShopData
  }
}

export async function getCheckoutData(encryptedShopData?: string) {
  try {
    const session = await getSession()
    if (session) {
      const encryptedShopData = cookies().get(
        `shopData_${session.user.id}`,
      )?.value
      if (!encryptedShopData) return null
      const decryptedData: CheckoutData = await decrypt(encryptedShopData)
      return decryptedData
    } else {
      if (!encryptedShopData) return null
      const decryptedData: CheckoutData = await decrypt(encryptedShopData)
      return decryptedData
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteCheckoutData() {
  try {
    const session = await getSession()
    if (session) cookies().delete(`shopData_${session.user.id}`)
  } catch (error) {
    throw error
  }
}
