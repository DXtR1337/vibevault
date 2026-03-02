'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { getMoodStats } from '@/app/actions';
import { Loader2, PieChart as PieChartIcon } from 'lucide-react';
import { useTheme } from '@/lib/theme';

// Cozy warm color palette for moods
const COLORS = {
    Positive: '#8F9E8B', // sage green
    Neutral: '#A89F96',  // warm gray
    Negative: '#C98B70', // terracotta
    Mixed: '#B8A9C9',    // soft lavender
    Unknown: '#E8DFD5'   // cream
};

interface MoodStats {
    name: string;
    value: number;
    [key: string]: any;
}

export default function MoodChart() {
    const [data, setData] = useState<MoodStats[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const { theme } = useTheme();

    const colors = {
        card: theme === 'dark' ? '#352E28' : '#FAF9F6',
        title: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        text: theme === 'dark' ? '#A89F96' : '#5C534E',
        border: theme === 'dark' ? '#4A413A' : '#E8DFD5',
        tooltipBg: theme === 'dark' ? '#3D3530' : '#FAF9F6',
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const stats = await getMoodStats();
            setData(stats);
            setIsGenerated(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="h-full rounded-2xl overflow-hidden shadow-md p-5 transition-colors duration-300"
            style={{ backgroundColor: colors.card }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5" style={{ color: '#8F9E8B' }} />
                <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.title, fontFamily: 'var(--font-lora), serif' }}
                >
                    Analiza Nastroju
                </h3>
            </div>

            {/* Content */}
            <div className="h-[220px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!isGenerated ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="action"
                            className="text-center"
                        >
                            <p className="text-sm mb-4" style={{ color: colors.text }}>
                                Sprawdź, jakie emocje dominują w Twoich notatkach.
                            </p>
                            <Button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="rounded-xl"
                                style={{ backgroundColor: '#8F9E8B', color: 'white' }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analizowanie...
                                    </>
                                ) : (
                                    "Generuj Wykres"
                                )}
                            </Button>
                        </motion.div>
                    ) : (data && data.length > 0) ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key="chart"
                            className="w-full h-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Unknown}
                                                strokeWidth={0}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: `1px solid ${colors.border}`,
                                            boxShadow: '0 4px 12px rgba(92, 83, 78, 0.1)',
                                            backgroundColor: colors.tooltipBg,
                                            color: colors.title
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span style={{ color: colors.text, fontSize: '12px' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key="empty"
                            className="text-center"
                            style={{ color: colors.text }}
                        >
                            Brak danych o sentymencie.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
