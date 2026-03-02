'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BrainCircuit, Settings, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'

export default function AppSidebar() {
    const pathname = usePathname()
    const { theme } = useTheme()

    const colors = {
        bg: theme === 'dark' ? 'rgba(42, 36, 31, 0.95)' : 'rgba(245, 239, 230, 0.95)',
        border: theme === 'dark' ? 'rgba(74, 65, 58, 0.5)' : 'rgba(232, 223, 213, 0.5)',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        muted: theme === 'dark' ? '#A89F96' : '#5C534E',
        hover: theme === 'dark' ? 'rgba(61, 53, 48, 0.5)' : 'rgba(232, 223, 213, 0.5)',
        active: 'rgba(143, 158, 139, 0.15)',
    }

    const NavItem = ({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) => (
        <Link href={href}>
            <div
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                    backgroundColor: isActive ? colors.active : 'transparent',
                    color: isActive ? '#8F9E8B' : colors.muted,
                }}
            >
                <Icon className="w-5 h-5 transition-colors" style={{ color: isActive ? '#8F9E8B' : colors.muted }} />
                <span className="font-medium text-sm">{label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8F9E8B' }} />
                )}
            </div>
        </Link>
    )

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-64 border-r z-50 flex flex-col p-4 transition-colors duration-300"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
            {/* Logo */}
            <div className="px-3 py-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #8F9E8B, #C98B70)' }}>
                        <span className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-lora), serif' }}>V</span>
                    </div>
                    <span className="font-bold text-xl" style={{ color: colors.text, fontFamily: 'var(--font-lora), serif' }}>
                        VibeVault
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Panel główny" isActive={pathname === '/dashboard'} />
                <NavItem href="/insights" icon={BarChart3} label="Analityka" isActive={pathname === '/insights'} />
                <NavItem href="/brain" icon={BrainCircuit} label="Widok mózgu" isActive={pathname === '/brain'} />
            </nav>

            {/* Footer */}
            <div className="pt-4 space-y-1" style={{ borderTop: `1px solid ${colors.border}` }}>
                <NavItem href="/settings" icon={Settings} label="Ustawienia" isActive={pathname === '/settings'} />
            </div>
        </aside>
    )
}
