'use client'

import { useEffect, useState } from 'react'
import { getNotes, getMoodStats } from '@/app/actions'
import { TrendingUp, Brain, Zap, Calendar, Tag, Sparkles, BarChart3 } from 'lucide-react'
import ActivityChart from '@/components/charts/ActivityChart'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'

// Cozy color palette for stat cards
const cardColors = [
    { bg: 'rgba(143, 158, 139, 0.15)', icon: '#8F9E8B' }, // sage
    { bg: 'rgba(201, 139, 112, 0.15)', icon: '#C98B70' }, // terracotta
    { bg: 'rgba(212, 168, 75, 0.15)', icon: '#D4A84B' },  // mustard
    { bg: 'rgba(184, 169, 201, 0.15)', icon: '#B8A9C9' }, // lavender
    { bg: 'rgba(168, 191, 168, 0.15)', icon: '#7A9E8B' }, // mint
    { bg: 'rgba(201, 170, 132, 0.15)', icon: '#A18F7F' }, // taupe
]

const moodColors: Record<string, string> = {
    'Positive': '#8F9E8B',
    'Neutral': '#A89F96',
    'Negative': '#C98B70',
    'Mixed': '#B8A9C9',
    'Unknown': '#E8DFD5'
}

export default function InsightsPage() {
    const [notes, setNotes] = useState<any[]>([])
    const [moodStats, setMoodStats] = useState<any[]>([])
    const { theme } = useTheme()

    const colors = {
        bg: theme === 'dark' ? '#2A241F' : '#F5EFE6',
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        text: theme === 'dark' ? '#A89F96' : '#5C534E',
        muted: theme === 'dark' ? '#8A8279' : '#A89F96',
        barBg: theme === 'dark' ? 'rgba(74, 65, 58, 0.5)' : 'rgba(232, 223, 213, 0.5)',
        tagBg: theme === 'dark' ? 'rgba(61, 53, 48, 0.5)' : 'rgba(232, 223, 213, 0.3)',
    }

    useEffect(() => {
        getNotes().then(setNotes)
        getMoodStats().then(setMoodStats)
    }, [])

    const totalNotes = notes?.length || 0
    const notesThisWeek = notes?.filter((n: any) => {
        const noteDate = new Date(n.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return noteDate > weekAgo
    }).length || 0

    const tagCounts: Record<string, number> = {}
    notes?.forEach((note: any) => {
        note.tags?.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
    })
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const moodMax = Math.max(...(moodStats?.map((m: any) => m.value) || [1]))

    const activityData = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toLocaleDateString('pl-PL', { weekday: 'short' })
        const count = notes?.filter((n: any) => {
            const noteDate = new Date(n.created_at)
            return noteDate.toDateString() === date.toDateString()
        }).length || 0
        activityData.push({ date: dateStr, count })
    }

    const StatCard = ({ icon: Icon, label, value, subtext, colorIndex }: { icon: any, label: string, value: string | number, subtext?: string, colorIndex: number }) => (
        <div className="rounded-2xl p-5 relative overflow-hidden shadow-md transition-all hover:shadow-lg" style={{ backgroundColor: colors.card }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-50" style={{ backgroundColor: cardColors[colorIndex % cardColors.length].bg }} />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: cardColors[colorIndex % cardColors.length].bg }}>
                        <Icon className="w-4 h-4" style={{ color: cardColors[colorIndex % cardColors.length].icon }} />
                    </div>
                    <span className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.muted }}>{label}</span>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>{value}</p>
                {subtext && <p className="text-xs" style={{ color: colors.muted }}>{subtext}</p>}
            </div>
        </div>
    )

    const MoodBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.text }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: colors.title }}>{value}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.barBg }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen w-full py-8 relative transition-colors duration-300" style={{ backgroundColor: colors.bg }}>
            {/* Decorative Elements */}
            <div className="fixed top-20 right-10 w-64 h-64 pointer-events-none opacity-5 z-0">
                {/* Large background pattern or gradient could go here */}
            </div>

            <div
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'top-0 right-0 w-80 h-80' : 'top-32 right-[-2rem] w-48 h-48 rotate-12'}`}
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
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'bottom-0 left-0 w-64 h-64' : 'bottom-10 left-[-2rem] w-56 h-56 -rotate-12'}`}
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

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl shadow-md" style={{ background: 'linear-gradient(135deg, #8F9E8B, #7A9E8B)' }}>
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>Analityka</h1>
                    </div>
                    <p style={{ color: colors.text }}>Zrozum swoje myśli, śledź postępy</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard icon={Brain} label="Notatki" value={totalNotes} subtext="Łącznie" colorIndex={0} />
                    <StatCard icon={Zap} label="Ten tydzień" value={notesThisWeek} subtext={notesThisWeek > 5 ? "Jesteś w formie!" : "Tak trzymaj!"} colorIndex={1} />
                    <StatCard icon={TrendingUp} label="Śr./dzień" value={(totalNotes / 30).toFixed(1)} subtext="Ostatnie 30 dni" colorIndex={2} />
                    <StatCard icon={Calendar} label="Seria" value="7 dni" subtext="Rekord osobisty!" colorIndex={3} />
                    <StatCard icon={Tag} label="Tagi" value={Object.keys(tagCounts).length} subtext="Unikalne" colorIndex={4} />
                    <StatCard icon={Sparkles} label="Słowa" value={notes?.reduce((acc: number, n: any) => acc + (n.content?.split(' ').length || 0), 0) || 0} subtext="Napisane" colorIndex={5} />
                </div>

                {/* Activity Chart */}
                <div className="mb-8">
                    <ActivityChart data={activityData} />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mood Distribution */}
                    <div className="lg:col-span-2 rounded-2xl p-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5" style={{ color: '#8F9E8B' }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>Rozkład Nastroju</h3>
                        </div>
                        <div className="space-y-4">
                            {moodStats && moodStats.length > 0 ? (
                                moodStats.map((mood: any) => (
                                    <MoodBar key={mood.name} label={mood.name} value={mood.value} max={moodMax} color={moodColors[mood.name] || moodColors.Unknown} />
                                ))
                            ) : (
                                <p className="text-center py-8" style={{ color: colors.muted }}>Brak danych o sentymencie. Dodaj więcej notatek!</p>
                            )}
                        </div>
                    </div>

                    {/* Top Tags */}
                    <div className="rounded-2xl p-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                        <div className="flex items-center gap-2 mb-6">
                            <Tag className="w-5 h-5" style={{ color: '#C98B70' }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}>Popularne Tagi</h3>
                        </div>
                        <div className="space-y-3">
                            {topTags.length > 0 ? (
                                topTags.map(([tag, count], i) => (
                                    <div key={tag} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: colors.tagBg }}>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: cardColors[i % cardColors.length].bg, color: cardColors[i % cardColors.length].icon }}>#{tag}</span>
                                        <span className="text-sm font-medium" style={{ color: colors.text }}>{count}×</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8" style={{ color: colors.muted }}>Brak tagów. Dodaj tagi do notatek!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
