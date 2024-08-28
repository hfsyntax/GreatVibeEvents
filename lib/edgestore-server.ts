import { initEdgeStoreClient } from "@edgestore/server/core"
import { initEdgeStore } from "@edgestore/server"
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create()
const edgeStoreRouter = es.router({
  myPublicImage: es.imageBucket({
    accept: ["image/jpeg", "image/png"],
  }),
})

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
})

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
})

export type EdgeStoreRouter = typeof edgeStoreRouter
