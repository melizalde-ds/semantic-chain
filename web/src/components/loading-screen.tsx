import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react"

export function LoadingScreen({ progress }: { progress: string }) {
    const pct = parseInt(progress) || 0

    return (
        <div className="flex min-h-svh items-center justify-center bg-background">
            <Card className="w-80">
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
                    <div className="text-center">
                        <p className="text-sm font-medium">Loading embedding model</p>
                        <p className="text-xs text-muted-foreground mt-1">~23MB download, cached after first load</p>
                    </div>
                    <Progress value={pct} className="w-full" />
                    <p className="text-xs text-muted-foreground font-mono">{progress || "Initializing..."}</p>
                </CardContent>
            </Card>
        </div>
    )
}