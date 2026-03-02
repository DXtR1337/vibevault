"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Panel,
    MarkerType,
    useReactFlow,
    BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import * as d3 from "d3-force"
import { NoteDetailsSheet } from "@/components/NoteDetailsSheet"
import { useTheme } from "@/lib/theme"

interface Note {
    id: string
    title: string
    content: string
    tags: string[]
    created_at: string
}

interface BrainGraphProps {
    notes: Note[]
}

type SimNode = d3.SimulationNodeDatum & {
    id: string
    type: 'note' | 'tag'
    data: any
}

type SimLink = d3.SimulationLinkDatum<SimNode> & {
    id: string
}

// Soft, cozy color palette for nodes
const noteColors = [
    '#E8DFD5', // cream
    '#D4E5D2', // mint
    '#F5E6D3', // peach
    '#E5E0F0', // lavender
    '#D9EDF8', // sky
]

const ForceLayoutGraph = ({ notes }: { notes: Note[] }) => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
    const { theme } = useTheme()
    const { setCenter, zoomTo } = useReactFlow() // Hook for camera control

    // Theme-aware color palettes - Updated for Creamier Light & Deep Espresso Dark
    const colors = {
        light: {
            noteColors: ['rgba(232, 223, 213, 0.85)', 'rgba(212, 229, 210, 0.85)', 'rgba(245, 230, 211, 0.85)', 'rgba(229, 224, 240, 0.85)', 'rgba(217, 237, 248, 0.85)'],
            noteText: '#3C312B',
            noteBorder: 'rgba(255, 255, 255, 0.6)',
            tagBg: 'rgba(143, 158, 139, 0.15)',
            tagText: '#6B7B68',
            edge: '#DBCAB0',
            bg: 'rgba(201, 139, 112, 0.03)',
            controls: '#FBF7F2',
            controlsText: '#5C534E',
            glow: '0 8px 32px rgba(60, 49, 43, 0.05)',
        },
        dark: {
            noteColors: ['rgba(53, 46, 40, 0.85)', 'rgba(61, 74, 61, 0.85)', 'rgba(74, 64, 53, 0.85)', 'rgba(69, 64, 80, 0.85)', 'rgba(56, 69, 80, 0.85)'],
            noteText: '#E8DFD5',
            noteBorder: 'rgba(232, 223, 213, 0.1)',
            tagBg: 'rgba(143, 158, 139, 0.25)',
            tagText: '#A8B8A5',
            edge: '#5A5049',
            bg: 'rgba(143, 158, 139, 0.02)',
            controls: '#352E28',
            controlsText: '#E8DFD5',
            glow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }
    }
    const c = colors[theme]

    const simulationRef = useRef<d3.Simulation<SimNode, SimLink>>(null)

    useEffect(() => {
        const simNodes: SimNode[] = []
        const simLinks: SimLink[] = []
        const tagMap = new Set<string>()
        const linkCounts: Record<string, number> = {} // Track connections for sizing

        // Initialize counts
        notes.forEach(n => linkCounts[n.id] = 0);

        notes.forEach((note, i) => {
            simNodes.push({
                id: note.id,
                type: 'note',
                data: { label: note.title || 'Bez tytułu', note, colorIndex: i % 5 },
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
            })
            note.tags.forEach(tag => tagMap.add(tag))
        })

        tagMap.forEach(tag => {
            simNodes.push({
                id: `tag-${tag}`,
                type: 'tag',
                data: { label: `#${tag}` },
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 600,
            })
            linkCounts[`tag-${tag}`] = 0
        })

        notes.forEach(note => {
            note.tags.forEach(tag => {
                const tagId = `tag-${tag}`
                simLinks.push({
                    id: `e-${note.id}-${tag}`,
                    source: note.id,
                    target: tagId,
                })
                // Increment connection counts
                linkCounts[note.id] = (linkCounts[note.id] || 0) + 1
                linkCounts[tagId] = (linkCounts[tagId] || 0) + 1
            })
        })

        // Physics Configuration for "Professional" Feel
        const simulation = d3.forceSimulation(simNodes)
            .force("link", d3.forceLink(simLinks).id((d: any) => d.id).distance(220).strength(0.15))
            .force("charge", d3.forceManyBody().strength(-400).distanceMax(800)) // Stronger repulsion
            .force("center", d3.forceCenter(0, 0))
            .force("collide", d3.forceCollide().radius((d: any) => {
                // Dynamic collision radius based on importance
                const count = linkCounts[d.id] || 0
                const baseSize = d.type === 'note' ? 80 : 40
                return baseSize + (count * 5) // Grow with connections
            }).strength(0.9))
            .alphaDecay(0.04)
            .velocityDecay(0.5)

        simulationRef.current = simulation;

        simulation.on("tick", () => {
            const rfNodes: Node[] = simNodes.map((node: any) => {
                const count = linkCounts[node.id] || 0
                const isNote = node.type === 'note'

                // Dynamic Sizing
                const minWidth = isNote ? 120 : 60
                const width = minWidth + (count * 10)
                const fontSize = isNote ? 12 : 10

                return {
                    id: node.id,
                    position: { x: node.x, y: node.y },
                    data: node.data,
                    style: isNote ? {
                        // Professional Glassmorphism Note
                        background: c.noteColors[node.data.colorIndex || 0],
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        color: c.noteText,
                        border: `1px solid ${c.noteBorder}`,
                        borderRadius: '16px',
                        padding: '12px 16px',
                        fontSize: `${fontSize}px`,
                        fontWeight: '600',
                        fontFamily: 'var(--font-serif), serif', // Use Serif for classy feel
                        width: 'auto',
                        minWidth: width,
                        maxWidth: 220,
                        textAlign: 'center',
                        boxShadow: c.glow,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    } : {
                        // Tag Pill with dynamic size
                        background: c.tagBg,
                        color: c.tagText,
                        border: '1px solid transparent',
                        borderRadius: '24px',
                        padding: '6px 14px',
                        fontSize: `${fontSize}px`,
                        fontWeight: '600',
                        fontFamily: 'var(--font-nunito), system-ui, sans-serif',
                        width: 'auto',
                        minWidth: width * 0.6,
                        textAlign: 'center',
                        cursor: 'default',
                        boxShadow: 'none',
                    },
                    type: 'default',
                    draggable: true,
                }
            })

            const rfEdges: Edge[] = simLinks.map((link: any) => ({
                id: link.id,
                source: (link.source as any).id,
                target: (link.target as any).id,
                style: {
                    stroke: c.edge,
                    strokeWidth: 1.5,
                    opacity: 0.5,
                },
                animated: false,
                type: 'default', // Bezier curve is default
            }))

            setNodes(rfNodes)
            setEdges(rfEdges)
        })

        return () => {
            simulation.stop()
        }
    }, [notes, setNodes, setEdges, theme]) // Re-run on theme change

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (node.id.startsWith('tag-')) return;

        // Focus Camera Animation
        setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 800 })

        setSelectedNote(node.data.note as Note)
    }, [setCenter])

    const onNodeDragStart = (_: any, node: Node) => {
        if (!simulationRef.current) return;
        simulationRef.current.alphaTarget(0.3).restart();
    }

    const onNodeDragStop = () => {
        if (!simulationRef.current) return;
        simulationRef.current.alphaTarget(0);
    }

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onNodeDragStart={onNodeDragStart}
                onNodeDragStop={onNodeDragStop}
                fitView
                className="transition-opacity duration-500 opacity-100"
                minZoom={0.1}
                maxZoom={2}
            >
                <Background color={c.edge} gap={24} size={1} variant={BackgroundVariant.Dots} style={{ opacity: 0.2 }} />
                <Controls
                    style={{
                        backgroundColor: c.controls,
                        border: 'none',
                        boxShadow: c.glow,
                        borderRadius: '8px',
                        color: c.controlsText,
                        padding: '4px'
                    }}
                />
            </ReactFlow>

            <NoteDetailsSheet
                note={selectedNote}
                isOpen={!!selectedNote}
                onClose={() => setSelectedNote(null)}
            />
        </>
    )
}

export default function BrainGraph({ notes }: BrainGraphProps) {
    const [isMounted, setIsMounted] = useState(false)
    const { theme } = useTheme()

    const colors = {
        bg: theme === 'dark' ? '#2A241F' : '#F5EFE6',
        text: theme === 'dark' ? '#E8DFD5' : '#3C312B',
        muted: theme === 'dark' ? '#A89F96' : '#5C534E',
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: colors.bg, color: colors.muted }}>
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm">Ładowanie mózgu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full transition-colors duration-300" style={{ backgroundColor: colors.bg, color: colors.text }}>
            <ReactFlowProvider>
                <ForceLayoutGraph notes={notes} />
            </ReactFlowProvider>
        </div>
    )
}

