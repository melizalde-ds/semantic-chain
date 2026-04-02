import type { ChainLink } from "@/lib/game"

function simColor(sim: number): string {
    // Goes from destructive-red (hue ~25) to primary-amber (hue ~70) to accent-yellow (hue ~95)
    const hue = Math.round(25 + sim * 70)
    const lightness = (0.60 + sim * 0.12).toFixed(2)
    return `oklch(${lightness} 0.18 ${hue})`
}

function Connector({ score, dashed }: { score?: number; dashed?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1 w-12 shrink-0">
            {/* Decorative line — color conveys similarity, not the sole indicator */}
            <div
                aria-hidden="true"
                className="w-full h-0.5 rounded-full"
                style={{
                    background: dashed ? undefined : score != null ? simColor(score) : "var(--border)",
                    borderTop: dashed ? "2px dashed var(--border)" : undefined,
                }}
            />
            {/* Text always uses a high-contrast foreground — color line is the secondary cue */}
            <span className="font-mono text-[11px] text-muted-foreground">
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
            <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 border-primary/40 bg-primary/5">
                <span className="font-mono font-bold text-sm">{startWord}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">start</span>
            </div>

            {/* Chain links */}
            {chain.map((link, i) => (
                <div key={i} className="contents">
                    <Connector score={link.similarity} />
                    <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 bg-secondary animate-in fade-in zoom-in-95 duration-300">
                        <span className="font-mono font-bold text-sm">{link.word}</span>
                        <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                    </div>
                </div>
            ))}

            {/* Target connector + node */}
            {gameOver ? (
                <>
                    <Connector score={chain.at(-1)?.targetSim} />
                    <div className="flex flex-col items-center gap-1 shrink-0 border rounded-lg px-4 py-2 border-primary/50 bg-primary/10 ring-2 ring-primary/20">
                        <span className="font-mono font-bold text-sm">{endWord}</span>
                        <span className="text-[10px] uppercase tracking-wider text-primary">reached!</span>
                    </div>
                </>
            ) : (
                <>
                    <Connector dashed />
                    <div className="flex flex-col items-center gap-1 shrink-0 border border-dashed rounded-lg px-4 py-2 opacity-50 border-primary/30">
                        <span className="font-mono font-bold text-sm">{endWord}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">target</span>
                    </div>
                </>
            )}
        </div>
    )
}