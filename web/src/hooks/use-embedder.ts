import { useEffect, useRef, useState, useCallback } from "react"

export function useEmbedder() {
  const workerRef = useRef<Worker | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState("")
  const pendingRef = useRef<Map<string, (emb: number[]) => void>>(new Map())

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/embedder.worker.ts", import.meta.url),
      { type: "module" }
    )

    worker.onmessage = (e) => {
      const { type, payload } = e.data
      if (type === "ready") setIsReady(true)
      if (type === "progress" && payload.progress) {
        setLoadProgress(`${Math.round(payload.progress)}%`)
      }
      if (type === "embedding") {
        const resolve = pendingRef.current.get(payload.id)
        if (resolve) {
          resolve(payload.embedding)
          pendingRef.current.delete(payload.id)
        }
      }
      if (type === "error") {
        setLoadProgress(`Error: ${payload}`)
      }
    }

    worker.postMessage({ type: "init" })
    workerRef.current = worker
    return () => worker.terminate()
  }, [])

  const embed = useCallback((text: string): Promise<number[]> => {
    return new Promise((resolve) => {
      const id = crypto.randomUUID()
      pendingRef.current.set(id, resolve)
      workerRef.current?.postMessage({
        type: "embed",
        payload: { text: text.toLowerCase().trim(), id },
      })
    })
  }, [])

  return { embed, isReady, loadProgress }
}