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

export type CheckoutData = {
  products: Array<{
    priceId: string
    quantity: number
    metadata?: {
      [key: string]: string
    }
  }>
  tip?: number
}

export type CartItem = {
  [priceId: string]: {
    stripeProduct: {
      product: Product
      amount: number | null
    } | null
    quantity: number
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
