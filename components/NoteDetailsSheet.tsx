"use client"

import { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateNote } from "@/app/actions"
import { Pencil, Save, X, Loader2, Calendar, Tag } from "lucide-react"

interface NoteDetails {
    id: string
    title: string
    content: string
    tags: string[]
    created_at: string
    image_url?: string
}

interface NoteDetailsSheetProps {
    note: NoteDetails | null
    isOpen: boolean
    onClose: () => void
}

// Cozy tag colors
const tagColors = [
    { bg: 'rgba(143, 158, 139, 0.2)', color: '#6B7B68' }, // sage
    { bg: 'rgba(201, 139, 112, 0.2)', color: '#A67054' }, // terracotta
    { bg: 'rgba(212, 168, 75, 0.2)', color: '#B08D3C' },  // mustard
    { bg: 'rgba(184, 169, 201, 0.2)', color: '#8A7A9E' }, // lavender
    { bg: 'rgba(168, 191, 168, 0.2)', color: '#5A7B5A' }, // mint
]

export function NoteDetailsSheet({ note, isOpen, onClose }: NoteDetailsSheetProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")

    useEffect(() => {
        if (note) {
            setTitle(note.title)
            setContent(note.content)
            setTags(note.tags.join(", "))
            setIsEditing(false)
        }
    }, [note])

    if (!note) return null

    const handleSave = async () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("tags", tags)

        await updateNote(note.id, formData)

        setIsLoading(false)
        setIsEditing(false)
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setIsEditing(false)
                onClose()
            }
        }}>
            <SheetContent
                className="w-[400px] sm:w-[540px] overflow-y-auto border-l-0 pl-4"
                style={{
                    backgroundColor: '#FAF9F6',
                    boxShadow: '-10px 0 40px rgba(92, 83, 78, 0.1)'
                }}
            >
                {/* Decorative accent bar - positioned outside the padding */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #8F9E8B, #C98B70)' }}
                />

                <SheetHeader className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-xl font-bold border-none"
                                style={{
                                    backgroundColor: 'rgba(232, 223, 213, 0.5)',
                                    color: '#3C312B',
                                    fontFamily: 'var(--font-lora), serif'
                                }}
                            />
                        ) : (
                            <SheetTitle
                                className="text-2xl font-bold flex items-center gap-2"
                                style={{ color: '#3C312B', fontFamily: 'var(--font-lora), serif' }}
                            >
                                {note.title || 'Bez tytułu'}
                            </SheetTitle>
                        )}

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                        disabled={isLoading}
                                        style={{ color: '#5C534E' }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="rounded-lg"
                                        style={{ backgroundColor: '#8F9E8B', color: 'white' }}
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-lg"
                                    style={{ color: '#5C534E' }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <SheetDescription asChild>
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4" style={{ color: '#8F9E8B' }} />
                                        <Input
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="Tagi (oddzielone przecinkami)..."
                                            className="border-none"
                                            style={{
                                                backgroundColor: 'rgba(232, 223, 213, 0.5)',
                                                color: '#3C312B'
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs" style={{ color: '#A89F96' }}>
                                        Notatki z tymi samymi tagami będą połączone w Widoku Mózgu.
                                    </p>
                                </>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {note.tags && note.tags.length > 0 ? (
                                        note.tags.map((tag, i) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-full text-sm font-medium"
                                                style={{
                                                    backgroundColor: tagColors[i % tagColors.length].bg,
                                                    color: tagColors[i % tagColors.length].color
                                                }}
                                            >
                                                #{tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm" style={{ color: '#A89F96' }}>Brak tagów</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Image preview if exists */}
                    {note.image_url && !note.image_url.match(/\.(mp3|wav|webm|ogg)$/i) && (
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={note.image_url}
                                alt=""
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Audio player if voice note */}
                    {note.image_url && note.image_url.match(/\.(mp3|wav|webm|ogg)$/i) && (
                        <div
                            className="p-4 rounded-xl"
                            style={{ backgroundColor: 'rgba(143, 158, 139, 0.15)' }}
                        >
                            <p className="text-xs font-medium mb-2 flex items-center gap-2" style={{ color: '#6B7B68' }}>
                                🎙️ Notatka głosowa
                            </p>
                            <audio controls src={note.image_url} className="w-full" />
                        </div>
                    )}

                    {isEditing ? (
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[300px] border-none text-sm leading-relaxed"
                            style={{
                                backgroundColor: 'rgba(232, 223, 213, 0.5)',
                                color: '#3C312B'
                            }}
                        />
                    ) : (
                        <div
                            className="whitespace-pre-wrap leading-relaxed text-base"
                            style={{ color: '#5C534E' }}
                        >
                            {note.content}
                        </div>
                    )}

                    {!isEditing && (
                        <div
                            className="flex items-center gap-2 pt-4 mt-8 text-xs"
                            style={{ borderTop: '1px solid rgba(232, 223, 213, 0.5)', color: '#A89F96' }}
                        >
                            <Calendar className="w-3 h-3" />
                            Utworzono: {new Date(note.created_at).toLocaleString('pl-PL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
