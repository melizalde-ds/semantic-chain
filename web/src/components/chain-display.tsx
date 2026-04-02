import type { ChainLink } from "@/lib/game"

function simColor(sim: number): string {
    const hue = Math.round(sim * 120)
    return `hsl(${hue}, 70%, 50%)`
}

function Connector({ score, dashed }: { score?: number; dashed?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1 w-12 shrink-0">
            <div
                className="w-full h-0.5 rounded-full"
                style={{
                    background: dashed ? undefined : score != null ? simColor(score) : "var(--border)",
                    borderTop: dashed ? "2px dashed var(--border)" : undefined,
                }}
            />
            <span
                className="font-mono text-[11px]"
                style={{ color: score != null ? simColor(score) : "var(--muted-foreground)" }}
            >
                {score != null ? `${Math.round(score * 100)}%` : "?"}
            </span>
        </div>
    )
}

interface Props {
    startWord: string
    endWord: string
    chain: ChainLink[]
    gameOver: boolean
}

export function ChainDisplay({ startWord, endWord, chain, gameOver }: Props) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto py-3 px-1">
            {/* Start node */}
            <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 border-blue-500/40 bg-blue-500/5">
                <span className="font-mono font-bold text-sm">{startWord}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">start</span>
            </div>

            {/* Chain links */}
            {chain.map((link, i) => (
                <div key={i} className="contents">
                    <Connector score={link.similarity} />
                    <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 animate-in fade-in zoom-in-95 duration-300">
                        <span className="font-mono font-bold text-sm">{link.word}</span>
                        <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                    </div>
                </div>
            ))}

            {/* Target connector + node */}
            {gameOver ? (
                <>
                    <Connector score={chain.at(-1)?.targetSim} />
                    <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                        <span className="font-mono font-bold text-sm">{endWord}</span>
                        <span className="text-[10px] uppercase tracking-wider text-green-500">reached!</span>
                    </div>
                </>
            ) : (
                <>
                    <Connector dashed />
                    <div className="flex flex-col items-center gap-1 shrink-0 border border-dashed rounded-lg px-4 py-2 opacity-50 border-green-500/30">
                        <span className="font-mono font-bold text-sm">{endWord}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">target</span>
                    </div>
                </>
            )}
        </div>
    )
}