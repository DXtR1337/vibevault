import { getNotes } from '@/app/actions'
import QuickCapture from '@/components/dashboard/QuickCapture'
import MoodChart from '@/components/dashboard/MoodChart'
import PodcastPlayer from '@/components/dashboard/PodcastPlayer'
import DashboardClient from '@/components/dashboard/DashboardClient'
import RecallWidget from '@/components/dashboard/RecallWidget'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const notes = await getNotes()

    return (
        <div className="min-h-screen w-full py-8">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Recall Widget */}
                <RecallWidget />

                {/* Quick Capture */}
                <QuickCapture />

                {/* Bento Grid - Compact Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <MoodChart />
                    <PodcastPlayer />
                </div>

                {/* Notes Masonry Grid */}
                <DashboardClient notes={notes as any[]} />
            </div>
        </div>
    )
}
