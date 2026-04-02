import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers"

let embedder: FeatureExtractionPipeline | null = null

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data

  if (type === "init") {
    try {
      embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
        dtype: "q8" as const,
        progress_callback: (p: Record<string, unknown>) => {
          self.postMessage({ type: "progress", payload: p })
        },
      })
      self.postMessage({ type: "ready" })
    } catch (err) {
      self.postMessage({ type: "error", payload: (err as Error).message })
    }
  }

  if (type === "embed") {
    if (!embedder) return
    const { text, id } = payload
    const output = await embedder(text, { pooling: "mean", normalize: true })
    self.postMessage({
      type: "embedding",
      payload: { id, text, embedding: Array.from(output.data as Float32Array) },
    })
  }
}