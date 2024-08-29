import { NextRequest, NextResponse } from "next/server"
import { initEdgeStoreClient } from "@edgestore/server/core"
import { initEdgeStore } from "@edgestore/server"
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create()
const edgeStoreRouter = es.router({
  myPublicImage: es
    .imageBucket({
      accept: ["image/jpeg", "image/png"],
    })
    .beforeDelete(({ ctx, fileInfo }) => {
      return true
    }),
})

export async function GET(request: NextRequest) {
  return createEdgeStoreNextHandler({ router: edgeStoreRouter })(request)
}

export async function POST(request: NextRequest) {
  if (
    [
      "/api/edgestore/request-upload",
      "/api/edgestore/confirm-upload",
      "/api/edgestore/delete-file",
    ].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  return createEdgeStoreNextHandler({ router: edgeStoreRouter })(request)
}

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
})

export type EdgeStoreRouter = typeof edgeStoreRouter
