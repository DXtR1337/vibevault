'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Square, RefreshCw, Radio, Mic2 } from 'lucide-react'
import { generateWeeklyScript } from '@/app/actions'
import { motion } from 'framer-motion'
import { useTheme } from '@/lib/theme'

export default function PodcastPlayer() {
    const [script, setScript] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const { theme } = useTheme()

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        text: theme === 'dark' ? '#A89F96' : '#5C534E',
        border: theme === 'dark' ? '#4A413A' : '#E8DFD5',
        accent: '#C98B70',
        sage: '#8F9E8B',
    }

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    const handleGenerate = async () => {
        setIsGenerating(true)
        handleStop()
        try {
            const result = await generateWeeklyScript()
            if (result.script) {
                setScript(result.script)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePlay = () => {
        if (!script) return
        if (window.speechSynthesis.paused && window.speechSynthesis.speaking) {
            window.speechSynthesis.resume()
            setIsPlaying(true)
            return
        }
        const u = new SpeechSynthesisUtterance(script)
        u.lang = 'pl-PL'
        u.rate = 1.0
        u.pitch = 1.0
        const voices = window.speechSynthesis.getVoices()
        const plVoice = voices.find(v => v.lang.includes('pl'))
        if (plVoice) u.voice = plVoice
        u.onend = () => setIsPlaying(false)
        utteranceRef.current = u
        window.speechSynthesis.speak(u)
        setIsPlaying(true)
    }

    const handlePause = () => {
        window.speechSynthesis.pause()
        setIsPlaying(false)
    }

    const handleStop = () => {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
    }

    useEffect(() => {
        window.speechSynthesis.getVoices()
    }, [])

    return (
        <div
            className="h-full rounded-2xl overflow-hidden shadow-md p-5 relative transition-colors duration-300"
            style={{ backgroundColor: colors.card }}
        >
            {/* Decorative icon */}
            <div className="absolute top-3 right-3 opacity-10">
                <Radio className="w-16 h-16" style={{ color: colors.accent }} />
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Mic2 className="w-5 h-5" style={{ color: colors.accent }} />
                <h3 className="text-lg font-semibold" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>
                    Tygodniowy Podcast
                </h3>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center py-6 min-h-[140px]">
                {isGenerating ? (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-center"
                    >
                        <RefreshCw className="w-8 h-8 animate-spin mb-2 mx-auto" style={{ color: colors.sage }} />
                        <p className="text-sm font-medium" style={{ color: colors.text }}>Pisanie scenariusza...</p>
                    </motion.div>
                ) : script ? (
                    <div className="text-center space-y-4 w-full">
                        <div className="text-xs font-mono uppercase tracking-widest" style={{ color: colors.text }}>Teraz Grane</div>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                onClick={isPlaying ? handlePause : handlePlay}
                                className="w-16 h-16 rounded-full shadow-lg transition-all hover:scale-105"
                                style={{ background: isPlaying ? colors.accent : `linear-gradient(135deg, ${colors.sage}, ${colors.accent})` }}
                            >
                                {isPlaying ? (
                                    <div className="flex gap-1">
                                        <span className="block w-1.5 h-5 bg-white rounded-full animate-pulse" />
                                        <span className="block w-1.5 h-5 bg-white rounded-full animate-pulse" />
                                    </div>
                                ) : (
                                    <Play className="w-8 h-8 text-white ml-1" />
                                )}
                            </Button>
                            {isPlaying && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleStop}
                                    className="rounded-full h-12 w-12"
                                    style={{ borderColor: colors.border, color: colors.text }}
                                >
                                    <Square className="w-4 h-4 fill-current" />
                                </Button>
                            )}
                        </div>
                        {isPlaying && (
                            <div className="flex justify-center gap-1 h-8 items-end">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 32, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                        className="w-1.5 rounded-full"
                                        style={{ backgroundColor: colors.sage }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-sm mb-4" style={{ color: colors.text }}>Podsumuj swój tydzień w formie audio.</p>
                        <Button
                            onClick={handleGenerate}
                            variant="outline"
                            className="rounded-xl"
                            style={{ borderColor: colors.border, color: colors.text }}
                        >
                            Generuj Odcinek
                        </Button>
                    </div>
                )}
            </div>

            {script && !isPlaying && !isGenerating && (
                <div
                    className="text-xs pt-4 max-h-[100px] overflow-y-auto italic"
                    style={{ borderTop: `1px solid ${colors.border}`, color: colors.text }}
                >
                    "{script.slice(0, 150)}..."
                </div>
            )}
        </div>
    )
}
