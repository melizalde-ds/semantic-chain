export const SIMILARITY_THRESHOLD = 0.35

export const WORD_PAIRS: [string, string][] = [
  ["pope", "wallet"], ["fire", "computer"], ["ocean", "clock"],
  ["moon", "breakfast"], ["sword", "library"], ["rain", "guitar"],
  ["castle", "telephone"], ["diamond", "forest"], ["rocket", "bread"],
  ["tiger", "piano"], ["volcano", "pencil"], ["ghost", "sandwich"],
  ["robot", "garden"], ["lightning", "pillow"], ["dragon", "bicycle"],
  ["whale", "hammer"], ["pyramid", "camera"], ["tornado", "chocolate"],
  ["skeleton", "umbrella"], ["astronaut", "candle"],
]

export function cosineSim(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function pickPair(): [string, string] {
  const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
  return Math.random() > 0.5 ? [pair[1], pair[0]] : [pair[0], pair[1]]
}

export interface ChainLink {
  word: string
  similarity: number
  targetSim: number
}

export interface GameState {
  startWord: string
  endWord: string
  chain: ChainLink[]
  lastEmbedding: number[] | null
  targetEmbedding: number[] | null
  gameOver: boolean
}

export function newGameState(start: string, end: string): GameState {
  return {
    startWord: start,
    endWord: end,
    chain: [],
    lastEmbedding: null,
    targetEmbedding: null,
    gameOver: false,
  }
}