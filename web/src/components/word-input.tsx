import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
    onSubmit: (word: string) => void
    disabled: boolean
    loading: boolean
}

export function WordInput({ onSubmit, disabled, loading }: Props) {
    const [value, setValue] = useState("")

    const handleSubmit = () => {
        const word = value.trim().toLowerCase()
        if (!word) return
        onSubmit(word)
        setValue("")
    }

    return (
        <div className="flex gap-2">
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type a word..."
                disabled={disabled || loading}
                className="font-mono"
            />
            <Button onClick={handleSubmit} disabled={disabled || loading || !value.trim()}>
                {loading ? "..." : "Link"}
            </Button>
        </div>
    )
}