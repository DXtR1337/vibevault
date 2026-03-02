'use client'

import { Settings as SettingsIcon, User, Palette, Key, Shield, Bell, Trash2, Globe, Moon, Sun, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { useState, useEffect } from 'react'

// Settings stored in localStorage
interface UserSettings {
    autoTags: boolean
    autoTitle: boolean
    sentimentAnalysis: boolean
    pushNotifications: boolean
    dailySummary: boolean
    language: string
    font: string
}

const defaultSettings: UserSettings = {
    autoTags: true,
    autoTitle: true,
    sentimentAnalysis: true,
    pushNotifications: false,
    dailySummary: false,
    language: 'pl',
    font: 'nunito'
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [settings, setSettings] = useState<UserSettings>(defaultSettings)
    const [saved, setSaved] = useState(false)

    // Load settings from localStorage
    useEffect(() => {
        const storedSettings = localStorage.getItem('vibevault-settings')
        if (storedSettings) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
            } catch (e) {
                console.error('Failed to parse settings')
            }
        }
    }, [])

    // Save settings to localStorage
    const saveSettings = (newSettings: Partial<UserSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        localStorage.setItem('vibevault-settings', JSON.stringify(updated))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    // Theme colors based on current theme
    const colors = {
        bg: theme === 'dark' ? '#2A241F' : '#F5EFE6',
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        muted: theme === 'dark' ? '#A89F96' : '#5C534E',
        border: theme === 'dark' ? 'rgba(74, 65, 58, 0.5)' : 'rgba(232, 223, 213, 0.5)',
        inputBg: theme === 'dark' ? 'rgba(61, 53, 48, 0.5)' : 'rgba(232, 223, 213, 0.5)',
    }

    return (
        <div className="min-h-screen w-full py-8 relative transition-colors duration-300" style={{ backgroundColor: colors.bg }}>
            {/* Tropical Decorations */}
            <div
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'bottom-0 right-0 w-80 h-80' : 'bottom-10 right-10 w-40 h-40'}`}
                style={{
                    opacity: theme === 'dark' ? 0.4 : 0.15,
                    transition: 'all 0.3s'
                }}
            >
                <Image
                    src={theme === 'dark' ? "/vibes-corner-dark.svg" : "/monstera.png"}
                    alt=""
                    fill
                    className="object-contain"
                    style={{ transform: theme === 'dark' ? 'rotate(0deg)' : 'none' }}
                />
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="p-2 rounded-xl shadow-md"
                            style={{ background: 'linear-gradient(135deg, #8F9E8B, #C98B70)' }}
                        >
                            <SettingsIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}
                        >
                            Ustawienia
                        </h1>
                        {saved && (
                            <span className="ml-auto flex items-center gap-1 text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(143, 158, 139, 0.2)', color: '#8F9E8B' }}>
                                <Check className="w-4 h-4" /> Zapisano
                            </span>
                        )}
                    </div>
                    <p style={{ color: colors.muted }}>Zarządzaj swoimi preferencjami i kontem</p>
                </div>

                {/* Appearance Section - WORKING THEME TOGGLE */}
                <div className="rounded-2xl p-6 mb-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(143, 158, 139, 0.15)' }}>
                            <Palette className="w-5 h-5" style={{ color: '#8F9E8B' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                                Wygląd
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.muted }}>Personalizuj wygląd aplikacji</p>

                            <div className="space-y-4">
                                {/* Theme Toggle - THIS WORKS! */}
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Motyw</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Wybierz jasny lub ciemny motyw</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'ring-2 ring-offset-2' : ''}`}
                                            style={{
                                                backgroundColor: theme === 'light' ? 'rgba(143, 158, 139, 0.2)' : colors.inputBg,
                                                color: theme === 'light' ? '#8F9E8B' : colors.muted
                                            }}
                                        >
                                            <Sun className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'ring-2 ring-offset-2' : ''}`}
                                            style={{
                                                backgroundColor: theme === 'dark' ? 'rgba(201, 139, 112, 0.2)' : colors.inputBg,
                                                color: theme === 'dark' ? '#C98B70' : colors.muted
                                            }}
                                        >
                                            <Moon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Język</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Wybierz język interfejsu</p>
                                    </div>
                                    <select
                                        value={settings.language}
                                        onChange={(e) => saveSettings({ language: e.target.value })}
                                        className="px-3 py-1.5 rounded-lg text-sm"
                                        style={{ backgroundColor: colors.inputBg, color: colors.text, border: 'none' }}
                                    >
                                        <option value="pl">Polski 🇵🇱</option>
                                        <option value="en">English 🇬🇧</option>
                                    </select>
                                </div>

                                {/* Font */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Czcionka</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Styl tekstu w notatkach</p>
                                    </div>
                                    <select
                                        value={settings.font}
                                        onChange={(e) => saveSettings({ font: e.target.value })}
                                        className="px-3 py-1.5 rounded-lg text-sm"
                                        style={{ backgroundColor: colors.inputBg, color: colors.text, border: 'none' }}
                                    >
                                        <option value="nunito">Nunito (Domyślna)</option>
                                        <option value="lora">Lora (Szeryfowa)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Configuration */}
                <div className="rounded-2xl p-6 mb-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(212, 168, 75, 0.15)' }}>
                            <Key className="w-5 h-5" style={{ color: '#D4A84B' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                                Konfiguracja AI
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.muted }}>Ustawienia sztucznej inteligencji</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Automatyczne tagi</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>AI generuje tagi dla nowych notatek</p>
                                    </div>
                                    <Switch
                                        checked={settings.autoTags}
                                        onCheckedChange={(checked) => saveSettings({ autoTags: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Automatyczny tytuł</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>AI generuje tytuł na podstawie treści</p>
                                    </div>
                                    <Switch
                                        checked={settings.autoTitle}
                                        onCheckedChange={(checked) => saveSettings({ autoTitle: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Analiza sentymentu</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>AI określa nastrój notatki</p>
                                    </div>
                                    <Switch
                                        checked={settings.sentimentAnalysis}
                                        onCheckedChange={(checked) => saveSettings({ sentimentAnalysis: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="rounded-2xl p-6 mb-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(201, 139, 112, 0.15)' }}>
                            <Bell className="w-5 h-5" style={{ color: '#C98B70' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                                Powiadomienia
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.muted }}>Kontroluj powiadomienia</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Powiadomienia push</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Otrzymuj przypomnienia</p>
                                    </div>
                                    <Switch
                                        checked={settings.pushNotifications}
                                        onCheckedChange={(checked) => saveSettings({ pushNotifications: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Dzienne podsumowanie</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Otrzymuj podsumowanie każdego dnia</p>
                                    </div>
                                    <Switch
                                        checked={settings.dailySummary}
                                        onCheckedChange={(checked) => saveSettings({ dailySummary: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy & Data */}
                <div className="rounded-2xl p-6 mb-6 shadow-md transition-colors" style={{ backgroundColor: colors.card }}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(143, 158, 139, 0.15)' }}>
                            <Shield className="w-5 h-5" style={{ color: '#8F9E8B' }} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                                Prywatność i dane
                            </h3>
                            <p className="text-sm mb-4" style={{ color: colors.muted }}>Zarządzaj swoimi danymi</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Eksportuj dane</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Pobierz wszystkie swoje notatki</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-lg"
                                        style={{ borderColor: colors.border, color: colors.muted }}
                                    >
                                        Eksportuj JSON
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.text }}>Usuń wszystkie dane</p>
                                        <p className="text-xs" style={{ color: colors.muted }}>Ta akcja jest nieodwracalna</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-lg flex items-center gap-2"
                                        style={{ borderColor: '#C98B70', color: '#C98B70' }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Usuń
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
