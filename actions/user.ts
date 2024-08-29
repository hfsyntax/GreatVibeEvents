"use server"
import { sql } from "@vercel/postgres"
import { error } from "console"

async function validateRecaptcha(token: string): Promise<boolean> {
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

  if (email.length > 128) {
    return {
      error: "Error: email must be 128 characters or less.",
      message: "",
    }
  }

  try {
    const emailExists =
      await sql`SELECT 1 FROM newsletter WHERE email = ${email}`
    if (emailExists.rows.length > 0) {
      return { error: "Error: email is already signed up.", message: "" }
    }
    await sql`INSERT INTO newsletter(email) VALUES(${email})`
    return { error: "", message: "Success." }
  } catch (error) {
    console.log(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}

export async function signUpVolunteer(formData: FormData) {
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

  const fields = ["name", "address", "number", "email", "message"]
  for (let field of fields) {
    if (!formData.get(field)) {
      return {
        error: `Error: ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
        message: "",
      }
    }
  }

  const name = String(formData.get("name"))

  if (!name.match(/^\S{1,127} \S{1,127}$/)) {
    return {
      error:
        "Error: Full name must include a space with 128 characters or less.",
      message: "",
    }
  }

  const address = String(formData.get("address"))

  if (address.length > 128) {
    return { error: "Error: Address is too long.", message: "" }
  }

  const number = String(formData.get("number"))

  if (!number.match(/^\d{7,20}$/)) {
    return {
      error: "Error: Phone number must be between 7-20 numbers.",
      message: "",
    }
  }

  const email = String(formData.get("email"))

  const validEmail =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  if (!email.match(validEmail)) {
    return {
      error: "Error: not a valid email.",
      message: "",
    }
  }

  if (email.length > 128) {
    return {
      error: "Error: Email must be 128 characters or less.",
      message: "",
    }
  }

  const message = String(formData.get("message"))

  if (message.length > 512) {
    return {
      error: "Error: Message must be 512 characters or less.",
      message: "",
    }
  }

  try {
    const volunteerExists =
      await sql`SELECT 1 from volunteers WHERE email = ${email}`
    if (volunteerExists.rows.length > 0) {
      return {
        error: "Error: a volunteer already exists with this email.",
        message: "",
      }
    }

    await sql`INSERT INTO volunteers (name, address, phone_number, email, message) VALUES (${name}, ${address}, ${number}, ${email}, ${message})`
    return { message: "Success.", error: "" }
  } catch (error) {
    console.log(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}
