export type FormEntry = {
  [key: string]: string
}

export type Product = {
  id: string
  name: string
  metadata?: { [key: string]: string }
  images: string[]
  created: number
  description?: string | null
}

export type ProductPrice = {
  id: string
  name: string
  amount: number | null
}

export type Session = {
  user: {
    email: string
    firstName: string
    lastName: string
    password: string
    type: "user" | "admin"
    id: number
    number: string
    address: string
  }
  expires: Date
  iat: number
  exp: number
}

export type CheckoutData = {
  products: Array<{
    priceId: string
    quantity: number
    metadata?: {
      [key: string]: string
    }
    tip?: number
  }>
  tip?: number
  userId?: number
}

export type CartItem = {
  [priceId: string]: {
    product: Product
    amount: number | null
    quantity: number
    tip?: number
    metadata?: {
      [key: string]: string
    }
  }
}

export type GalleryImage = {
  url: string
  thumbnailUrl: string | null
  size: number
  uploadedAt: Date
  metadata: Record<string, never>
  path: Record<string, never>
}

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
