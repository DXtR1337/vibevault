// Simplified mock of shadcn/ui use-toast
import { useState, useEffect } from "react"

export const useToast = () => {
    return {
        toast: ({ title, description, variant }: { title: string, description?: string, variant?: "default" | "destructive" }) => {
            console.log(`[TOAST] ${title}: ${description} (${variant})`)
            if (variant === 'destructive') {
                // alert(`Error: ${title}\n${description}`)
            }
        },
        dismiss: (toastId?: string) => { },
    }
}
