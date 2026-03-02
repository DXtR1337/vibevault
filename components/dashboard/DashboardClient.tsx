"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import NoteCard from "./NoteCard"
import { NoteDetailsSheet } from "../NoteDetailsSheet"

interface Note {
    id: string
    content: string
    title: string
    tags: string[]
    created_at: string
    image_url?: string
}

export default function DashboardClient({ notes }: { notes: Note[] }) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const noteId = searchParams.get('note')
        if (noteId && notes) {
            const noteToOpen = notes.find(n => n.id === noteId)
            if (noteToOpen) {
                setSelectedNote(noteToOpen)
            }
        }
    }, [searchParams, notes])

    const handleClose = () => {
        setSelectedNote(null)
        // clean up URL without full refresh
        const params = new URLSearchParams(searchParams.toString())
        params.delete('note')
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {notes?.map((note, index) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        index={index}
                        onClick={() => setSelectedNote(note)}
                    />
                ))}

                {(!notes || notes.length === 0) && (
                    <div className="col-span-full text-center py-20" style={{ color: '#A89F96' }}>
                        <p>No vibes yet. Add your first note above! ✨</p>
                    </div>
                )}
            </div>

            <NoteDetailsSheet
                note={selectedNote}
                isOpen={!!selectedNote}
                onClose={handleClose}
            />
        </>
    )
}
