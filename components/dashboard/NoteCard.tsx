'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { deleteNote } from '@/app/actions'
import { motion } from 'framer-motion'
import { NoteIllustration } from '@/lib/illustrations'
import { useTheme } from '@/lib/theme'

interface Note {
    id: string
    content: string
    title?: string
    tags?: string[]
    created_at: string
    image_url?: string
    illustration_svg?: string
}

// Tag color pairs [bg, text] for light and dark
const tagColorPairs = [
    ['rgba(143, 158, 139, 0.2)', '#6B7B68'],
    ['rgba(201, 139, 112, 0.2)', '#A67054'],
    ['rgba(212, 168, 75, 0.2)', '#B08D3C'],
    ['rgba(184, 169, 201, 0.2)', '#8A7A9E'],
]

export default function NoteCard({ note, index, onClick }: { note: Note; index: number; onClick?: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const { theme } = useTheme()

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        text: theme === 'dark' ? '#A89F96' : '#5C534E',
        muted: theme === 'dark' ? '#8A8279' : '#A89F96',
        accent: '#C98B70',
        mediaBg: theme === 'dark' ? '#3D3530' : '#E8DFD5',
        audioBg: theme === 'dark' ? 'rgba(143, 158, 139, 0.15)' : 'rgba(143, 158, 139, 0.1)',
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Czy na pewno chcesz usunąć tę notatkę?')) return
        setIsDeleting(true)
        try {
            const result = await deleteNote(note.id)
            if (result && result.error) {
                alert(`Błąd: ${result.error}`)
                setIsDeleting(false)
            }
            // If success, nothing else to do, component will unmount or list will refresh
        } catch (error) {
            console.error('Failed to delete:', error)
            alert('Wystąpił nieoczekiwany błąd podczas usuwania.')
            setIsDeleting(false)
        }
    }

    const hasMedia = note.image_url && !note.image_url.match(/\.(mp3|wav|webm|ogg)$/i)
    const hasAudio = note.image_url && note.image_url.match(/\.(mp3|wav|webm|ogg)$/i)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="mb-6 break-inside-avoid relative group"
        >
            <div
                onClick={onClick}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all relative shadow-md hover:shadow-lg"
                style={{ backgroundColor: colors.card }}
            >
                {/* Delete button */}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-xl z-10"
                    style={{ color: colors.text }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = colors.accent; e.currentTarget.style.backgroundColor = 'rgba(201, 139, 112, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = colors.text; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    title="Usuń notatkę"
                >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>

                {hasMedia && (
                    <div className="w-full h-48 overflow-hidden" style={{ backgroundColor: colors.mediaBg }}>
                        <img src={note.image_url} alt={note.title || ""} className="w-full h-full object-cover" />
                    </div>
                )}

                {hasAudio && (
                    <div className="p-4" style={{ backgroundColor: colors.audioBg }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #8F9E8B, #C98B70)' }}>
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium mb-1" style={{ color: '#6B7B68' }}>Notatka głosowa</p>
                                <audio controls src={note.image_url} className="w-full h-8 rounded-lg" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                        {!hasMedia && !hasAudio && (
                            <div className="flex-shrink-0 opacity-70 w-10 h-10">
                                {note.illustration_svg ? (
                                    <div dangerouslySetInnerHTML={{ __html: note.illustration_svg }} className="w-full h-full" />
                                ) : (
                                    <NoteIllustration tags={note.tags || []} size={40} />
                                )}
                            </div>
                        )}
                        <h3 className="flex-1 text-lg font-semibold leading-tight pr-6" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>
                            {note.title || 'Bez tytułu'}
                        </h3>
                    </div>

                    <p className="text-sm mb-4 line-clamp-4 leading-relaxed" style={{ color: colors.text }}>
                        {note.content}
                    </p>

                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {note.tags.slice(0, 4).map((tag, i) => (
                                <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tagColorPairs[i % tagColorPairs.length][0], color: tagColorPairs[i % tagColorPairs.length][1] }}>
                                    #{tag}
                                </span>
                            ))}
                            {note.tags.length > 4 && <span className="text-sm" style={{ color: colors.muted }}>+{note.tags.length - 4} więcej</span>}
                        </div>
                    )}

                    <p className="text-xs font-medium" style={{ color: colors.muted }}>
                        {new Date(note.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
