'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { createNote, createVoiceNote } from '@/app/actions'
import { Loader2, Plus, X, Image as ImageIcon, Mic } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function AddNoteForm() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null) // Image file
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null) // New state for review

    // Voice State
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const { toast } = useToast()
    const router = useRouter()

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

        toast({ title: "Processing Voice Note...", description: "Transcribing audio..." })
        const result = await createVoiceNote(formData)
        handleResult(result)
    }

    const handleResult = (result: any) => {
        if (result?.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            setContent('')
            setTags('')
            setFile(null)
            setAudioBlob(null) // Clear audio
            setIsExpanded(false)
            toast({
                title: "Success",
                description: "Note created successfully!",
            })
            router.refresh()
        }
        setIsLoading(false)
    }

    const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        setAudioBlob(null) // Clear previous recording if any
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
                console.log("Audio Blob Size:", blob.size);

                if (blob.size < 500) {
                    toast({ title: "Nagranie za krótkie", description: "Proszę mówić nieco dłużej.", variant: "destructive" })
                    return
                }

                // Instead of auto-uploading, set state for Review
                setAudioBlob(blob)
                setIsExpanded(true) // Ensure form is open to see the review UI

                // Stop tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (err) {
            console.error('Mic error:', err)
            toast({ title: "Error", description: "Could not access microphone.", variant: "destructive" })
        }
    }

    const stopRecording = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-20">
            <AnimatePresence>
                {!isExpanded ? (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative" // Container for positioning mic
                    >
                        <div
                            onClick={() => setIsExpanded(true)}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-4 cursor-pointer flex items-center gap-4 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex-1 text-zinc-400 font-medium ml-2">What's on your mind? ...</div>

                            {/* Mic Button (Collapsed State) */}
                            {isRecording ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        stopRecording(e)
                                    }}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm animate-pulse mr-2 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    Stop Recording
                                </button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(true);
                                        startRecording(e);
                                    }}
                                    type="button"
                                    className="p-3 rounded-full transition-all relative z-30 mr-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                >
                                    <Mic className="w-5 h-5 relative z-10" />
                                </motion.button>
                            )}

                            <Button
                                size="icon"
                                className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="expanded"
                        layout
                        initial={{ borderRadius: 24 }}
                        animate={{ borderRadius: isExpanded ? 16 : 24 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-zinc-900 shadow-xl shadow-indigo-500/10 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="p-6">
                            <motion.div key="textarea">
                                <Textarea
                                    placeholder="Write your thoughts..."
                                    className="min-h-[150px] text-lg border-none focus-visible:ring-0 resize-none p-0 bg-transparent placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    autoFocus
                                />
                            </motion.div>

                            <motion.div layout className="mt-6 flex flex-col gap-4">
                                <Input
                                    placeholder="Tags (separated by comma)..."
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 font-mono text-sm"
                                />

                                {file && (
                                    <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg truncate">
                                        <ImageIcon className="w-4 h-4" />
                                        {file.name}
                                        <button onClick={() => setFile(null)} className="ml-auto hover:text-red-500">×</button>
                                    </div>
                                )}

                                {audioBlob && (
                                    <div className="flex flex-col gap-2 p-3 bg-indigo-50 dark:bg-zinc-900/50 rounded-xl border border-indigo-100 dark:border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                                <Mic className="w-3 h-3" /> Voice Note Recorded
                                            </span>
                                            <button
                                                onClick={() => setAudioBlob(null)}
                                                className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                            >
                                                <X className="w-3 h-3" /> Discard
                                            </button>
                                        </div>

                                        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full h-8 mt-1" />

                                        <Button
                                            size="sm"
                                            onClick={handleVoiceSubmit}
                                            disabled={isLoading}
                                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                                            Transcribe & Save
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="image-upload"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50" asChild>
                                        <span><ImageIcon className="w-5 h-5" /></span>
                                    </Button>
                                </label>

                                {/* Mic Button inside expanded form */}
                                {isRecording ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            stopRecording(e)
                                        }}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm animate-pulse flex items-center gap-2 transition-all shadow-md"
                                        type="button"
                                    >
                                        <span className="w-2 h-2 bg-white rounded-full"></span>
                                        Stop Recording
                                    </button>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            startRecording(e)
                                        }}
                                        type="button"
                                        className="p-2 rounded-full transition-all relative flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50"
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
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading || (!content.trim() && !file)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Note'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
