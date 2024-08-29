"use server"
import { backendClient } from "@/lib/edgestore-server"

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
