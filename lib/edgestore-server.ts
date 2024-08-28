import { NextRequest, NextResponse } from "next/server"
import { initEdgeStoreClient } from "@edgestore/server/core"
import { initEdgeStore } from "@edgestore/server"
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create()
const edgeStoreRouter = es.router({
  myPublicImage: es.imageBucket({
    accept: ["image/jpeg", "image/png"],
  }),
})

export async function GET(request: NextRequest) {
  return createEdgeStoreNextHandler({ router: edgeStoreRouter })(request)
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/edgestore/request-upload") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  return createEdgeStoreNextHandler({ router: edgeStoreRouter })(request)
}

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
})

export type EdgeStoreRouter = typeof edgeStoreRouter
