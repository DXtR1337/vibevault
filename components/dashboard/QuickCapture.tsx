'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { createNote, createVoiceNote } from '@/app/actions'
import { Loader2, Image as ImageIcon, Mic, Send, X, Sparkles } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from '@/lib/theme'

export default function QuickCapture() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    // Voice State
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const { toast } = useToast()
    const router = useRouter()
    const { theme } = useTheme()

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#FFFFFF' : '#3C312B',
        text: theme === 'dark' ? '#E0E0E0' : '#5C534E',
        border: theme === 'dark' ? '#4A413A' : '#E8DFD5',
        inputBg: theme === 'dark' ? 'rgba(61, 53, 48, 0.5)' : 'rgba(232, 223, 213, 0.3)',
        accent: '#C98B70',
        sage: '#8F9E8B',
    }

    const handleSubmit = async () => {
        if (!content.trim() && !file) return
        setIsLoading(true)
        const formData = new FormData()
        formData.append('content', content)
        formData.append('tags', tags)
        if (file) formData.append('image', file)

        const result = await createNote(formData)
        handleResult(result)
    }

    const handleVoiceSubmit = async () => {
        if (!audioBlob) return
        setIsLoading(true)
        const audioFile = new File([audioBlob], 'voice-memo.webm', { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', audioFile)

        toast({ title: "Przetwarzam...", description: "Transkrybuję nagranie głosowe..." })
        const result = await createVoiceNote(formData)
        handleResult(result)
    }

    const handleResult = (result: any) => {
        if (result?.error) {
            toast({
                title: "Błąd",
                description: result.error,
                variant: "destructive",
            })
        } else {
            setContent('')
            setTags('')
            setFile(null)
            setAudioBlob(null)
            setIsExpanded(false)
            toast({
                title: "Zapisano! ✨",
                description: "Notatka została utworzona pomyślnie.",
            })
            router.refresh()
        }
        setIsLoading(false)
    }

    const startRecording = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setAudioBlob(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                setIsRecording(false)
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

                if (blob.size < 500) {
                    toast({ title: "Nagranie za krótkie", description: "Proszę mówić nieco dłużej.", variant: "destructive" })
                    return
                }

                setAudioBlob(blob)
                setIsExpanded(true)

                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (err) {
            console.error('Mic error:', err)
            toast({ title: "Błąd", description: "Nie można uzyskać dostępu do mikrofonu.", variant: "destructive" })
        }
    }

    const stopRecording = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative"
                    >
                        <div
                            onClick={() => setIsExpanded(true)}
                            className="rounded-2xl p-5 cursor-text flex items-center gap-4 transition-all group shadow-md"
                            style={{ backgroundColor: colors.card }}
                        >
                            <Sparkles className="w-5 h-5" style={{ color: colors.sage }} />
                            <div className="flex-1 font-medium" style={{ color: colors.text }}>
                                Co masz na myśli?
                            </div>

                            <div className="flex items-center gap-2">
                                {isRecording ? (
                                    <button
                                        onClick={stopRecording}
                                        className="px-3 py-2 bg-accent-terracotta/20 hover:bg-accent-terracotta/30 text-accent-terracotta rounded-xl font-medium text-sm animate-pulse flex items-center gap-2 border border-accent-terracotta/30"
                                    >
                                        <span className="w-2 h-2 bg-accent-terracotta rounded-full"></span>
                                        Zatrzymaj
                                    </button>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={startRecording}
                                        className="p-2 rounded-xl transition-all bg-cozy-light/50 text-cozy-coffee hover:bg-accent-sage/10 hover:text-accent-sage"
                                    >
                                        <Mic className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl overflow-hidden shadow-md transition-colors duration-300"
                        style={{ backgroundColor: colors.card }}
                    >
                        <div className="p-6">
                            <Textarea
                                placeholder="Zapisz swoją myśl..."
                                className="min-h-[120px] text-lg border-none focus-visible:ring-0 resize-none p-0 bg-transparent placeholder:text-muted-foreground font-sans"
                                style={{ color: colors.title }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                autoFocus
                            />

                            <div className="mt-4 flex flex-col gap-3">
                                <Input
                                    placeholder="Tagi (oddzielone przecinkami)..."
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="bg-cozy-light/30 border-cozy-light text-sm placeholder:text-muted-foreground"
                                    style={{ color: colors.title }}
                                />

                                {file && (
                                    <div className="flex items-center gap-2 text-xs text-accent-sage bg-accent-sage/10 p-2 rounded-lg border border-accent-sage/20">
                                        <ImageIcon className="w-4 h-4" />
                                        {file.name}
                                        <button onClick={() => setFile(null)} className="ml-auto hover:text-accent-terracotta">×</button>
                                    </div>
                                )}

                                {audioBlob && (
                                    <div className="flex flex-col gap-2 p-3 bg-accent-sage/10 rounded-xl border border-accent-sage/20">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-accent-sage flex items-center gap-2">
                                                <Mic className="w-3 h-3" /> Notatka głosowa nagrana
                                            </span>
                                            <button
                                                onClick={() => setAudioBlob(null)}
                                                className="text-xs text-cozy-coffee hover:text-accent-terracotta flex items-center gap-1 transition-colors"
                                            >
                                                <X className="w-3 h-3" /> Usuń
                                            </button>
                                        </div>

                                        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full h-8 mt-1 rounded-lg" />

                                        <Button
                                            size="sm"
                                            onClick={handleVoiceSubmit}
                                            disabled={isLoading}
                                            className="w-full mt-2 btn-sage"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                                            Transkrybuj i zapisz
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between border-t border-cozy-light/50" style={{ borderColor: `rgba(${theme === 'dark' ? '74, 65, 58' : '232, 223, 213'}, 0.3)` }}>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="ghost" size="icon" className="text-cozy-coffee hover:text-accent-sage hover:bg-accent-sage/10" asChild>
                                        <span><ImageIcon className="w-5 h-5" /></span>
                                    </Button>
                                </label>

                                {isRecording ? (
                                    <button
                                        onClick={stopRecording}
                                        className="px-3 py-2 bg-accent-terracotta/20 hover:bg-accent-terracotta/30 text-accent-terracotta rounded-xl font-medium text-sm animate-pulse flex items-center gap-2 border border-accent-terracotta/30"
                                    >
                                        <span className="w-2 h-2 bg-accent-terracotta rounded-full"></span>
                                        Zatrzymaj
                                    </button>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={startRecording}
                                        className="p-2 rounded-xl transition-all text-cozy-coffee hover:text-accent-sage hover:bg-accent-sage/10"
                                    >
                                        <Mic className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setIsExpanded(false)
                                        setContent('')
                                        setFile(null)
                                    }}
                                    className="text-cozy-coffee"
                                >
                                    Anuluj
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || (!content.trim() && !file)}
                                    className="btn-sage min-w-[100px]"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    {isLoading ? 'Zapisuję...' : 'Zapisz'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}
