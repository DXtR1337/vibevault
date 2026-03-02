'use client'

import AppSidebar from "@/components/AppSidebar";
import ChatSidebar from "@/components/dashboard/ChatSidebar";
import Image from "next/image";
import { useTheme } from "@/lib/theme";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();

    const colors = {
        bg: theme === 'dark' ? '#2A241F' : '#F2E8DC',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
    };

    return (
        <div
            className="flex min-h-screen w-full overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: colors.bg, color: colors.text }}
        >
            {/* Fixed Left Sidebar */}
            <AppSidebar />

            {/* Decorations */}
            <div
                className={`fixed pointer-events-none z-0 ${theme === 'dark' ? 'bottom-0 left-64 w-64 h-64' : 'bottom-0 left-64 w-48 h-48'}`}
                style={{
                    opacity: theme === 'dark' ? 0.6 : 0.2, // Increased opacity for thin SVG lines
                    transition: 'opacity 0.3s'
                }}
            >
                <Image
                    src={theme === 'dark' ? "/vibes-corner-dark.svg" : "/tropical-leaves.png"}
                    alt=""
                    fill
                    className="object-contain"
                    style={{ transform: theme === 'dark' ? 'scaleY(-1)' : 'none' }}
                />
            </div>
            <div
                className={`fixed top-0 right-0 pointer-events-none z-0 ${theme === 'dark' ? 'w-80 h-80' : 'w-64 h-64 rotate-180'}`}
                style={{
                    opacity: theme === 'dark' ? 0.5 : 0.15,
                    transition: 'opacity 0.3s'
                }}
            >
                <Image
                    src={theme === 'dark' ? "/vibes-corner-dark.svg" : "/tropical-corner.png"}
                    alt=""
                    fill
                    className="object-contain"
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 h-screen overflow-y-auto relative no-scrollbar">
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </main>

            {/* Right Floating Chat */}
            <ChatSidebar />
        </div>
    );
}
