import { Progress } from "@/components/ui/progress"
import { SIMILARITY_THRESHOLD } from "@/lib/game"

interface Props {
    similarity: number
    targetWord: string
}

export function ProximityBar({ similarity, targetWord }: Props) {
    const normalized = Math.max(0, (similarity - 0.1) / (SIMILARITY_THRESHOLD - 0.1))
    const fillPct = Math.min(100, Math.round(normalized * 100))

    return (
        <div className="space-y-2">
            <Progress value={fillPct} className="h-2" />
            <p className="text-xs font-mono text-muted-foreground">
                {Math.round(similarity * 100)}% similar to "{targetWord}" (need {Math.round(SIMILARITY_THRESHOLD * 100)}%)
            </p>
        </div>
    )
}