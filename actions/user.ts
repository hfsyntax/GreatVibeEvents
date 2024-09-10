"use server"
import type { FormEntry } from "@/components/form/FormHandler"
import { getSession } from "@/lib/session"
import { sql } from "@vercel/postgres"
import { genSalt, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { getPaymentIntent, updatePaymentIntent } from "@/lib/stripe"

export async function validateRecaptcha(token: string): Promise<boolean> {
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

export async function createAccount(formData: FormData) {
  if (!formData.get("g-recaptcha-response")) {
    return { error: "Error: failed to set recaptcha token.", message: "" }
  }

  const recaptchaToken = String(formData.get("g-recaptcha-response"))
  const validRecaptchaResponse = await validateRecaptcha(recaptchaToken)

  if (!validRecaptchaResponse) {
    return { error: "Error: reCAPTCHA validation failed.", message: "" }
  }

  const fields = ["first", "last", "email", "password", "password-repeat"]
  for (let field of fields) {
    if (!formData.get(field)) {
      return {
        error: `Error: ${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
        message: "",
      }
    }
  }

  const first = String(formData.get("first"))

  if (first.length > 63) {
    return {
      error: "Error: First name must be 63 characters or less.",
      message: "",
    }
  }

  const last = String(formData.get("last"))

  if (last.length > 63) {
    return {
      error: "Error: Last name must be 63 characters or less.",
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

  const number = String(formData.get("number"))

  if (formData.get("number") && !number.match(/^\d{7,20}$/)) {
    return {
      error: "Error: Phone number must be between 7-20 numbers.",
      message: "",
    }
  }

  const password = String(formData.get("password"))

  const validPassword = /^(?=.*[A-Z])(?=.*\d).{6,}$/

  if (!password.match(validPassword)) {
    return {
      error:
        "Error: password must contain at least 6 characters, 1 uppercase letter and 1 number",
      message: "",
    }
  }

  if (password.length > 128) {
    return {
      error: "Error: Password must be 128 characters or less.",
      message: "",
    }
  }

  const repeatPassword = String(formData.get("password-repeat"))

  if (password !== repeatPassword) {
    return { error: "Error: Passwords do not match.", message: "" }
  }

  try {
    const userExists = await sql`SELECT 1 from users WHERE email = ${email}`
    if (userExists.rows.length > 0) {
      return {
        error: "Error: a user already exists with this email.",
        message: "",
      }
    }

    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    await sql`INSERT INTO users (first, last, email, password, number) VALUES (${first}, ${last}, ${email}, ${hashedPassword}, ${number})`

    return { message: "Success.", error: "" }
  } catch (error) {
    console.error(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}

export async function signUpForNewsletter(formData: FormData) {
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
    console.error(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}

export async function signUpVolunteer(formData: FormData) {
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

  if (!name.match(/^\S{1,63} \S{1,63}$/)) {
    return {
      error:
        "Error: Full name must include a space with less than 128 characters.",
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
    console.error(error)
    return { error: "Error: Database connection error.", message: "" }
  }
}

export async function handleEventForm(
  formData: FormData,
  paymentIntent: string
): Promise<FormEntry> {
  try {
    const session = await getSession()
    if (!session) return { no_session: "Error: no session" }
    if (!formData)
      return {
        no_data: "Error: form data cannot be empty",
      }
    if (!paymentIntent)
      return {
        no_payment: "Error: payment intent cannot be empty",
      }

    const token = formData.get("g-recaptcha-response")

    if (!token) {
      return {
        no_token: "Error: could not set recaptcha token",
      }
    }

    const validToken = await validateRecaptcha(String(token))

    if (!validToken) {
      return {
        invalid_token: "Error: invalid recaptcha token",
      }
    }

    const paymentData = await getPaymentIntent(paymentIntent)
    const eventId = paymentData.metadata?.eventId
    const userId = Number(paymentData.metadata?.userId)
    const eventName = paymentData.metadata?.eventName
    if (!eventId)
      return {
        invalid_eventid: "Error: event id not found for payment.",
      }
    if (!userId) {
      return {
        no_userid: "Error: user id not found for payment.",
      }
    }

    if (session?.user?.id !== userId) {
      return { no_user_id: "Error: not authenticated." }
    }

    const formValues: FormEntry = {
      "participant-name": "Participant First/Last Name",
      "participant-gender": "Participant Gender",
      "participant-birthday": "Participant Date of Birth",
      "participant-cell": "Participant Cell #",
      "participant-email": "Participant Email",
      "participant-address": "Participant Address",
      "participant-eaosh": "Epilepsy and/or Seizure History",
      "participant-dols": "Date of last seizure",
      "participant-r11r": "Does the participant require 1:1 attendant ratio",
      "participant-uafd":
        "Does the participant understand and follow directions",
      "participant-allergies": "Participant Allergies & Dietary Restrictions",
      "participant-medications": "Participant medications",
      "participant-bites-or-stings": "Participant bites or stings",
      "participant-food-allergies": "Participant food allergies",
      "participant-special-dietary-needs": "Participant dietary needs",
      "participant-ctctmt": "Consent to medical treatment on his or her behalf",
      "participant-activity-interests": "Participant activity interests",
      "participant-additional-enjoyment": "Participant additional enjoyment",
      "guardian-name": "Guardian First & Last Name",
      "guardian-relationship": "Guardian Relationship",
      "guardian-number": "Guardian Cell #",
      "guardian-email": "Guardian Email",
      "guardian-address": "Guardian Address",
      "emergency-contact": "Emergency contact",
      "emergency-relationship": "Emergency Relationship",
      "emergency-number": "Emergency Cell #",
      "emergency-email": "Emergency Email",
      "participant-name-confirm": "Name of participant",
      "participant-signature": "Participant Signature",
      "participant-date-signed": "Participant Date Signed",
      "guardian-name-confirm": "Name of Guardian",
      "guardian-signature": "Guardian Signature",
      "guardian-date-signed": "Guardian Date Signed",
    }

    const errors: FormEntry = {}
    for (let key of Object.keys(formValues)) {
      if (
        key === "participant-dols" &&
        formValues["participant-eaosh"] !== "yes"
      ) {
        continue
      }

      if (!formData.get(key)) {
        errors[key] = `${formValues[key]} is required.`
      }
    }

    if (Object.keys(errors).length > 0) {
      return errors
    }

    const participantName = String(formData.get("participant-name"))
    const participantGender = String(formData.get("participant-gender"))
    const participantBirthday = String(formData.get("participant-birthday"))
    const participantCell = String(formData.get("participant-cell"))
    const participantEmail = String(formData.get("participant-email"))
    const participantAddress = String(formData.get("participant-address"))
    const participantOtherDisorders = String(
      formData.get("participant-other-disorders")
    )
    const participantEaosh = String(formData.get("participant-eaosh"))
    const participantDols = String(formData.get("participant-dols"))
      ? String(formData.get("participant-dols"))
      : null
    const participantR11r = String(formData.get("participant-r11r"))
    const participantUafd = String(formData.get("participant-uafd"))
    const participantAllergies = String(formData.get("participant-allergies"))
    const participantMedications = String(
      formData.get("participant-medications")
    )
    const participantBitesOrStrings = String(
      formData.get("participant-bites-or-stings")
    )
    const participantFoodAllergies = String(
      formData.get("participant-food-allergies")
    )
    const participantDietary = String(
      formData.get("participant-special-dietary-needs")
    )
    const participantCtctmt = String(formData.get("participant-ctctmt"))
    const participantInterests = String(
      formData.get("participant-activity-interests")
    )
    const participantEnjoyment = String(
      formData.get("participant-additional-enjoyment")
    )
    const guardianName = String(formData.get("guardian-name"))
    const guardianRelationship = String(formData.get("guardian-relationship"))
    const guardianCell = String(formData.get("guardian-number"))
    const guardianEmail = String(formData.get("guardian-email"))
    const guardianAddress = String(formData.get("guardian-address"))
    const emergencyContact = String(formData.get("emergency-contact"))
    const emergencyRelationship = String(formData.get("emergency-relationship"))
    const emergencyCell = String(formData.get("emergency-number"))
    const emergencyEmail = String(formData.get("emergency-email"))
    const participantNameConfirm = String(
      formData.get("participant-name-confirm")
    )
    const participantDateSigned = String(
      formData.get("participant-date-signed")
    )
    const guardianNameConfirm = String(formData.get("guardian-name-confirm"))
    const guardianDateSigned = String(formData.get("guardian-date-signed"))
    const participantSignature = String(formData.get("participant-signature"))
    const guardianSignature = String(formData.get("guardian-signature"))
    await sql`INSERT INTO event_form_data 
    (user_id, participant_name, participant_gender, participant_birthday, participant_number, participant_email, participant_address, participant_other_disorders, participant_eaosh, participant_dols, participant_r11r, participant_uafd, participant_allergies, participant_medications, participant_bites_or_stings, participant_food_allergies, participant_special_dietary_needs, participant_ctctmt, participant_activity_interests, participant_additional_enjoyment, guardian_name, guardian_relationship, guardian_number, guardian_email, guardian_address, emergency_contact, emergency_relationship, emergency_number, emergency_email, participant_name_confirm, participant_date_signed, guardian_name_confirm, guardian_date_signed, participant_signed, guardian_signed) 
    VALUES (${userId}, ${participantName}, ${participantGender}, ${participantBirthday}, ${participantCell}, ${participantEmail}, ${participantAddress}, ${participantOtherDisorders}, ${participantEaosh}, ${participantDols}, ${participantR11r}, ${participantUafd}, ${participantAllergies}, ${participantMedications}, ${participantBitesOrStrings}, ${participantFoodAllergies}, ${participantDietary}, ${participantCtctmt}, ${participantInterests}, ${participantEnjoyment}, ${guardianName}, ${guardianRelationship}, ${guardianCell}, ${guardianEmail}, ${guardianAddress}, ${emergencyContact}, ${emergencyRelationship}, ${emergencyCell}, ${emergencyEmail}, ${participantNameConfirm}, ${participantDateSigned}, ${guardianNameConfirm}, ${guardianDateSigned}, ${participantSignature}, ${guardianSignature})`
    await updatePaymentIntent(paymentIntent, {
      metadata: {
        eventId: eventId,
        eventName: eventName,
        userId: userId,
        formCompleted: "true",
      },
    })
    revalidatePath(`/form?payment_intent=${paymentIntent}`)
    return {}
  } catch (error: any) {
    if (error.type === "StripeInvalidRequestError") {
      return { error: error.raw.message, message: "" }
    }
    console.error(error)
    return {
      other_error: "Internal server error processing form",
    }
  }
}
