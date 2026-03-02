'use client'

import { useEffect, useState } from 'react'
import { getNotes } from '@/app/actions'
import BrainGraph from '@/components/brain/BrainGraph'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'

export default function BrainPage() {
    const [notes, setNotes] = useState<any[]>([])
    const { theme } = useTheme()

    const colors = {
        bg: theme === 'dark' ? '#2A241F' : '#F2E8DC',
        card: theme === 'dark' ? '#352E28' : '#FBF7F2',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        muted: theme === 'dark' ? '#A89F96' : '#5C534E',
        badgeBg: theme === 'dark' ? 'rgba(143, 158, 139, 0.3)' : 'rgba(143, 158, 139, 0.2)',
        badgeText: theme === 'dark' ? '#A8B8A5' : '#6B7B68',
    }

    useEffect(() => {
        getNotes().then(setNotes)
    }, [])

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden relative transition-colors duration-300" style={{ backgroundColor: colors.bg }}>
            {/* Decorative Elements - lower opacity in dark mode */}
            {/* Decorative Elements */}
            <div
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'top-0 right-0 w-80 h-80' : 'top-20 right-10 w-32 h-32'}`}
                style={{
                    opacity: theme === 'dark' ? 0.6 : 0.15,
                    transition: 'all 0.3s'
                }}
            >
                <Image
                    src={theme === 'dark' ? "/vibes-corner-dark.svg" : "/monstera.png"}
                    alt=""
                    fill
                    className="object-contain"
                />
            </div>
            <div
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'bottom-0 left-0 w-64 h-64' : 'bottom-10 left-72 w-40 h-40 -rotate-12'}`}
                style={{
                    opacity: theme === 'dark' ? 0.6 : 0.12,
                    transition: 'all 0.3s'
                }}
            >
                <Image
                    src={theme === 'dark' ? "/vibes-corner-dark.svg" : "/palm-branch.png"}
                    alt=""
                    fill
                    className="object-contain"
                    style={{ transform: theme === 'dark' ? 'scaleX(-1) rotate(180deg)' : 'none' }}
                />
            </div>

            {/* Header */}
            <header className="absolute top-4 left-4 z-20 flex items-center gap-4">
                <Link href="/dashboard">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-none shadow-md transition-colors"
                        style={{ backgroundColor: colors.card, color: colors.muted }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div className="px-4 py-2.5 rounded-xl shadow-md flex items-center gap-3" style={{ backgroundColor: colors.card }}>
                    <Sparkles className="w-4 h-4" style={{ color: '#8F9E8B' }} />
                    <h1 className="font-semibold" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                        Mapa Myśli
                    </h1>
                    <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}
                    >
                        {notes?.length || 0} notatek
                    </span>
                </div>
            </header>

            {/* Graph Area */}
            <div className="flex-1 relative z-10">
                <BrainGraph notes={notes || []} />
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-20 p-4 rounded-xl shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                <p className="text-xs font-medium mb-2" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                    Legenda
                </p>
                <div className="space-y-1.5 text-xs" style={{ color: colors.muted }}>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: theme === 'dark' ? 'linear-gradient(135deg, #4A413A, #3D4A3D)' : 'linear-gradient(135deg, #F5EFE6, #E8DFD5)' }}
                        />
                        <span>Notatka</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #8F9E8B, #7A9E8B)' }} />
                        <span>Tag (połączenie)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
