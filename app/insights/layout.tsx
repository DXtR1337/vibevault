import AppSidebar from "@/components/AppSidebar";

export default function InsightsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full bg-cozy-cream text-cozy-brown overflow-hidden">
            <AppSidebar />
            <main className="flex-1 ml-64 h-screen overflow-y-auto relative no-scrollbar">
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
