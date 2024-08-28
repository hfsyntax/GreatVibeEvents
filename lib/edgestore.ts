"use client"
import { EdgeStoreRouter } from "@/lib/edgestore-server"
import { createEdgeStoreProvider } from "@edgestore/react"

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>()
