'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react'
import { chatWithVault } from '@/app/actions'
import { clsx } from 'clsx'
import { Textarea } from '@/components/ui/textarea'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Cześć! Jestem VibeVault AI. Zadaj mi pytanie o swoje notatki.' }
    ])
    const [isPending, setIsPending] = useState(false)

    const handleSend = async () => {
        if (!query.trim() || isPending) return;

        const userMsg = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsPending(true);

        try {
            const result = await chatWithVault(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: result.answer || 'Brak odpowiedzi.' }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Wystąpił błąd podczas rozmowy.' }]);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl text-white p-0 z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #8F9E8B, #C98B70)' }}
                    size="icon"
                >
                    <MessageSquare className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[90vw] sm:w-[500px] flex flex-col h-full p-0 border-l border-border bg-background">
                <SheetHeader className="px-6 py-4 border-b border-border bg-card">
                    <SheetTitle className="flex items-center gap-2 text-foreground">
                        <Bot className="w-5 h-5 text-primary" />
                        VibeVault Chat
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "flex gap-3",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === 'user' ? "bg-muted" : "bg-primary/20"
                            )}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                            </div>
                            <div className={clsx(
                                "p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-accent text-accent-foreground rounded-tr-sm"
                                    : "bg-card border border-border rounded-tl-sm shadow-sm text-foreground"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <div className="p-4 rounded-2xl rounded-tl-sm bg-card border border-border shadow-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-card">
                    <div className="flex items-end gap-2">
                        <Textarea
                            placeholder="Zapytaj o swoje notatki..."
                            className="flex-1 min-h-[44px] max-h-[160px] resize-none bg-muted border-none text-foreground placeholder:text-muted-foreground"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isPending || !query.trim()}
                            className="h-11 w-11 rounded-xl shrink-0 text-white"
                            style={{ background: 'linear-gradient(135deg, #8F9E8B, #C98B70)' }}
                            size="icon"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
