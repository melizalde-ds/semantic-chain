import { Progress } from "@/components/ui/progress"
import { SIMILARITY_THRESHOLD } from "@/lib/game"

interface Props {
    similarity: number
    targetWord: string
}

export function ProximityBar({ similarity, targetWord }: Props) {
    const normalized = Math.max(0, (similarity - 0.1) / (SIMILARITY_THRESHOLD - 0.1))
    const fillPct = Math.min(100, Math.round(normalized * 100))

    const proximityLabel = fillPct >= 80 ? "Close!" : fillPct >= 50 ? "Getting warmer" : "Far away"
    // Color reinforces the text label — never the sole indicator
    const labelColor = fillPct >= 80 ? "text-primary" : fillPct >= 50 ? "text-chart-2" : "text-destructive"

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
                <span className={`text-xs font-medium ${labelColor}`}>{proximityLabel}</span>
                <span className="text-xs font-mono text-muted-foreground">
                    {Math.round(similarity * 100)}% / {Math.round(SIMILARITY_THRESHOLD * 100)}% needed
                </span>
            </div>
            <Progress
                value={fillPct}
                className="h-2"
                aria-label={`Proximity to "${targetWord}": ${Math.round(similarity * 100)}% of ${Math.round(SIMILARITY_THRESHOLD * 100)}% needed`}
            />
        </div>
    )
}