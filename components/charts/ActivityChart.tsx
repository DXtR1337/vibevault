'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '@/lib/theme'

interface ActivityChartProps {
    data: { date: string; count: number }[]
}

export default function ActivityChart({ data }: ActivityChartProps) {
    const { theme } = useTheme()

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        axis: theme === 'dark' ? '#8A8279' : '#A89F96',
        border: theme === 'dark' ? '#4A413A' : '#E8DFD5',
        tooltipBg: theme === 'dark' ? '#3D3530' : '#FAF9F6',
        tooltipText: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        tooltipLabel: theme === 'dark' ? '#A89F96' : '#5C534E',
    }

    return (
        <div
            className="rounded-2xl p-6 shadow-md transition-colors duration-300"
            style={{ backgroundColor: colors.card }}
        >
            <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}
            >
                📈 Aktywność (ostatnie 7 dni)
            </h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8F9E8B" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#8F9E8B" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke={colors.axis}
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={colors.axis}
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: colors.tooltipBg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '12px',
                                color: colors.tooltipText,
                                boxShadow: '0 4px 12px rgba(92, 83, 78, 0.1)'
                            }}
                            labelStyle={{ color: colors.tooltipLabel }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#8F9E8B"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorActivity)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
