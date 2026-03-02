'use client'

import { useState, useEffect } from 'react'
import { getRecallNote } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

export default function RecallWidget() {
    const [recallData, setRecallData] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { theme } = useTheme()

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        muted: theme === 'dark' ? '#A89F96' : '#5C534E',
        border: theme === 'dark' ? '#4A413A' : '#E8DFD5',
        badgeBg: theme === 'dark' ? 'rgba(143, 158, 139, 0.15)' : 'rgba(143, 158, 139, 0.1)',
        badgeText: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        accentGradient: 'linear-gradient(135deg, #8F9E8B, #C98B70)',
        glow: theme === 'dark' ? 'rgba(201, 139, 112, 0.1)' : 'rgba(143, 158, 139, 0.15)',
    }

    useEffect(() => {
        const fetchRecall = async () => {
            try {
                const data = await getRecallNote()
                if (data) {
                    setRecallData(data)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchRecall()
    }, [])

    const handleOpenNote = () => {
        if (recallData?.noteId) {
            router.push(`?note=${recallData.noteId}`, { scroll: false })
        }
    }

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsVisible(false)
    }

    if (!isVisible || loading || !recallData) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 cursor-pointer"
                onClick={handleOpenNote}
            >
                <div
                    className="relative group rounded-xl p-[1px] shadow-lg transition-all hover:shadow-xl duration-300"
                    style={{ background: colors.accentGradient }}
                >
                    <div
                        className="rounded-[11px] p-5 h-full relative overflow-hidden transition-all duration-300"
                        style={{ backgroundColor: colors.card }}
                    >
                        {/* Abstract Background Decoration */}
                        <div
                            className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full blur-3xl"
                            style={{ backgroundColor: colors.glow }}
                        />

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3 h-3" style={{ color: '#C98B70' }} />
                                    <span style={{ color: colors.muted }}>Przypomnienie z przeszłości</span>
                                </div>
                                <h3
                                    className="text-xl font-bold mb-1 leading-snug"
                                    style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}
                                >
                                    {recallData.question}
                                </h3>
                                <div className="flex items-center gap-2 text-sm mt-1" style={{ color: colors.muted }}>
                                    <span>Dotyczy notatki:</span>
                                    <span
                                        className="font-medium px-2 py-0.5 rounded text-xs truncate max-w-[200px] border"
                                        style={{
                                            backgroundColor: colors.badgeBg,
                                            color: colors.badgeText,
                                            borderColor: colors.border
                                        }}
                                    >
                                        {recallData.noteTitle}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full transition-colors"
                                    style={{
                                        borderColor: colors.border,
                                        color: colors.muted,
                                        backgroundColor: 'transparent'
                                    }}
                                    onClick={handleClose}
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    <span>Ukryj</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
