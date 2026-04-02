import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingScreen } from "@/components/loading-screen"
import { ChainDisplay } from "@/components/chain-display"
import { ProximityBar } from "@/components/proximity-bar"
import { WordInput } from "@/components/word-input"
import { useEmbedder } from "@/hooks/use-embedder"
import {
  cosineSim, pickPair, newGameState,
  SIMILARITY_THRESHOLD,
  type GameState,
} from "@/lib/game"

export default function App() {
  const { embed, isReady, loadProgress } = useEmbedder()
  const [game, setGame] = useState<GameState | null>(null)
  const [status, setStatus] = useState<{ msg: string; type: "info" | "success" | "error" }>({ msg: "", type: "info" })
  const [targetSim, setTargetSim] = useState(0)
  const [computing, setComputing] = useState(false)

  const startNewGame = useCallback(async () => {
    const [start, end] = pickPair()
    const state = newGameState(start, end)

    const [startEmb, endEmb] = await Promise.all([embed(start), embed(end)])
    state.lastEmbedding = startEmb
    state.targetEmbedding = endEmb

    const initSim = cosineSim(startEmb, endEmb)
    setTargetSim(initSim)
    setGame(state)
    setStatus({ msg: `Connect "${start}" to "${end}"`, type: "info" })
  }, [embed])

  useEffect(() => {
    if (isReady) startNewGame()
  }, [isReady, startNewGame])

  const handleSubmit = async (word: string) => {
    if (!game || game.gameOver || !game.lastEmbedding || !game.targetEmbedding) return

    if (word === game.startWord || word === game.endWord || game.chain.some((l) => l.word === word)) {
      setStatus({ msg: "Word already used!", type: "error" })
      return
    }

    setComputing(true)
    try {
      const emb = await embed(word)
      const simPrev = cosineSim(game.lastEmbedding, emb)
      const simTarget = cosineSim(emb, game.targetEmbedding)

      if (simPrev < SIMILARITY_THRESHOLD) {
        setStatus({
          msg: `"${word}" is too far from the previous word (${Math.round(simPrev * 100)}% < ${Math.round(SIMILARITY_THRESHOLD * 100)}%)`,
          type: "error",
        })
        return
      }

      const link = { word, similarity: simPrev, targetSim: simTarget }
      const won = simTarget >= SIMILARITY_THRESHOLD || word === game.endWord

      setGame((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          chain: [...prev.chain, link],
          lastEmbedding: emb,
          gameOver: won,
        }
      })
      setTargetSim(simTarget)

      if (won) {
        setStatus({ msg: `Reached "${game.endWord}" in ${game.chain.length + 1} steps!`, type: "success" })
      } else {
        setStatus({ msg: `Linked! Now get to "${game.endWord}"`, type: "success" })
      }
    } catch (err) {
      setStatus({ msg: (err as Error).message, type: "error" })
    } finally {
      setComputing(false)
    }
  }

  if (!isReady) return <LoadingScreen progress={loadProgress} />

  if (!game) return null

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col items-center p-6 gap-4 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Semantic Chain</h1>
        <p className="text-sm text-muted-foreground">connect words through meaning</p>
      </div>

      {/* Challenge */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-blue-500 border-blue-500/30 font-mono">{game.startWord}</Badge>
        <span className="text-muted-foreground">→ → →</span>
        <Badge variant="outline" className="text-green-500 border-green-500/30 font-mono">{game.endWord}</Badge>
      </div>

      {/* Chain */}
      <Card className="w-full">
        <CardContent className="pt-4">
          <ChainDisplay
            startWord={game.startWord}
            endWord={game.endWord}
            chain={game.chain}
            gameOver={game.gameOver}
          />
        </CardContent>
      </Card>

      {/* Proximity */}
      <div className="w-full">
        <ProximityBar similarity={targetSim} targetWord={game.endWord} />
      </div>

      {/* Input */}
      {!game.gameOver ? (
        <div className="w-full">
          <WordInput onSubmit={handleSubmit} disabled={game.gameOver} loading={computing} />
        </div>
      ) : (
        <Button onClick={startNewGame} variant="outline">New Round</Button>
      )}

      {/* Status */}
      <p className={`text-sm font-mono ${status.type === "error" ? "text-red-500" :
          status.type === "success" ? "text-green-500" :
            "text-muted-foreground"
        }`}>
        {status.msg}
      </p>

      <p className="text-xs text-muted-foreground font-mono mt-auto">
        Each link needs ≥35% cosine similarity. Fewer steps = better. All inference runs locally via WASM.
      </p>
    </div>
  )
}