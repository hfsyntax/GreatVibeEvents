"use server"
import { backendClient } from "@/lib/edgestore-server"
import { sql } from "@vercel/postgres"

export type GalleryImage = {
  url: string
  thumbnailUrl: string | null
  size: number
  uploadedAt: Date
  metadata: Record<string, never>
  path: Record<string, never>
}

export async function getGalleryImageUrls(
  amount: number
): Promise<{ items: Array<GalleryImage>; more: boolean }> {
  try {
    const imageUrls: Array<GalleryImage> = []
    let page = 1
    let remaining = amount
    let canRequestMore = false
    while (imageUrls.length < amount) {
      const res = await backendClient.myPublicImage.listFiles({
        pagination: {
          currentPage: page,
          pageSize: Math.min(remaining, 100),
        },
      })

      if (res.data.length === 0) break

      imageUrls.push(...res.data)

      remaining -= Math.min(remaining, 100)
      const nextPage = res.pagination.currentPage < res.pagination.totalPages

      if (remaining <= 0 || !nextPage) {
        canRequestMore = nextPage
        break
      }

      page++
    }
    return { items: imageUrls, more: canRequestMore }
  } catch (error) {
    console.log(error)
    throw new Error("server error retrieving images")
  }
}

const validateRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    )
    const responseBody = await recaptchaResponse.json()
    return responseBody?.success && responseBody?.score >= 0.3
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function signUpForNewsletter(formData: FormData) {
  if (!formData) {
    return { error: "Error: no form data.", message: "" }
  }

  if (!formData.get("g-recaptcha-response")) {
    return { error: "Error: failed to set recaptcha token.", message: "" }
  }

  const recaptchaToken = String(formData.get("g-recaptcha-response"))
  const validRecaptchaResponse = await validateRecaptcha(recaptchaToken)

  if (!validRecaptchaResponse) {
    return { error: "Error: reCAPTCHA validation failed.", message: "" }
  }

  if (!formData.get("email")) {
    return { error: "Error: email cannot be empty.", message: "" }
  }

  const email = String(formData.get("email"))

  const validEmail =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  if (!email.match(validEmail)) {
    return { error: "Error: not a valid email.", message: "" }
  }

  try {
    const emailExists =
      await sql`SELECT 1 FROM newsletter WHERE email = ${email}`
    if (emailExists.rows.length > 0) {
      return { error: "Error: email is already signed up.", message: "" }
    }
    await sql`INSERT INTO newsletter(email) VALUES(${email})`
    return { error: "", message: "Success" }
  } catch (error) {
    console.log(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}
