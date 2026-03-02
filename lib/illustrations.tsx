// Tropical SVG illustrations for notes
// Each tag category gets a unique tropical/cozy icon

interface IllustrationData {
    svg: string
    color: string
}

const categoryIcons: Record<string, IllustrationData> = {
    // Work/Business
    'praca': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 20C35 20 25 35 25 50C25 65 35 80 50 80C65 80 75 65 75 50C75 35 65 20 50 20Z" fill="currentColor" opacity="0.2"/><path d="M30 50C30 40 35 30 50 30M50 70C40 70 35 60 35 55" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
        color: '#8F9E8B'
    },
    'spotkanie': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><circle cx="35" cy="45" r="15" fill="currentColor" opacity="0.3"/><circle cx="65" cy="45" r="15" fill="currentColor" opacity="0.3"/><path d="M25 80C25 65 35 55 50 55C65 55 75 65 75 80" stroke="currentColor" stroke-width="3" fill="none"/></svg>`,
        color: '#C98B70'
    },
    'projekt': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><rect x="20" y="30" width="60" height="45" rx="5" fill="currentColor" opacity="0.2"/><path d="M35 45L45 55L65 40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
        color: '#D4A84B'
    },

    // Creative
    'pomysł': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 15C35 15 25 28 25 45C25 55 30 62 40 67L40 75C40 80 45 85 50 85C55 85 60 80 60 75L60 67C70 62 75 55 75 45C75 28 65 15 50 15Z" fill="currentColor" opacity="0.3"/><path d="M45 55L50 60L55 55" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="35" r="5" fill="currentColor"/></svg>`,
        color: '#D4A84B'
    },
    'kreatywność': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 20L55 40L75 40L60 52L65 75L50 62L35 75L40 52L25 40L45 40Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/></svg>`,
        color: '#B8A9C9'
    },

    // Nature/Tropical
    'natura': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85L50 45M30 45C30 30 40 20 50 20C60 20 70 30 70 45C70 60 60 70 50 70C40 70 30 60 30 45Z" stroke="currentColor" stroke-width="3" fill="currentColor" fill-opacity="0.2"/><path d="M35 55C35 55 42 50 50 50C58 50 65 55 65 55" stroke="currentColor" stroke-width="2"/></svg>`,
        color: '#8F9E8B'
    },
    'palma': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 90L50 50" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M50 50C50 50 30 35 20 25" stroke="currentColor" stroke-width="3"/><path d="M50 50C50 50 70 35 80 25" stroke="currentColor" stroke-width="3"/><path d="M50 50C50 50 40 30 35 15" stroke="currentColor" stroke-width="3"/><path d="M50 50C50 50 60 30 65 15" stroke="currentColor" stroke-width="3"/><path d="M50 50C50 50 50 25 50 10" stroke="currentColor" stroke-width="3"/></svg>`,
        color: '#7A9E8B'
    },
    'monstera': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85L50 55M50 55C35 55 20 45 20 30C20 20 30 15 40 15C45 15 50 20 50 25M50 55C65 55 80 45 80 30C80 20 70 15 60 15C55 15 50 20 50 25" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="2"/><ellipse cx="35" cy="40" rx="5" ry="8" fill="#FAF9F6"/><ellipse cx="65" cy="40" rx="5" ry="8" fill="#FAF9F6"/></svg>`,
        color: '#8F9E8B'
    },

    // Emotions
    'radość': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.2"/><circle cx="38" cy="45" r="4" fill="currentColor"/><circle cx="62" cy="45" r="4" fill="currentColor"/><path d="M35 60Q50 75 65 60" stroke="currentColor" stroke-width="3" fill="none"/></svg>`,
        color: '#D4A84B'
    },
    'spokój': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M20 50Q35 35 50 50Q65 65 80 50" stroke="currentColor" stroke-width="3" fill="none"/><path d="M20 60Q35 45 50 60Q65 75 80 60" stroke="currentColor" stroke-width="2" opacity="0.5"/><path d="M20 70Q35 55 50 70Q65 85 80 70" stroke="currentColor" stroke-width="1" opacity="0.3"/></svg>`,
        color: '#8F9E8B'
    },

    // Personal
    'osobiste': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 25L55 45L75 50L55 55L50 75L45 55L25 50L45 45Z" fill="currentColor" opacity="0.3"/><circle cx="50" cy="50" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
        color: '#C98B70'
    },
    'zdrowie': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 80L25 55C15 45 15 30 25 25C35 20 45 25 50 35C55 25 65 20 75 25C85 30 85 45 75 55Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/></svg>`,
        color: '#C98B70'
    },

    // Default tropical leaf
    'default': {
        svg: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85L50 50M25 50C25 30 35 15 50 15C65 15 75 30 75 50C75 65 65 75 50 75C35 75 25 65 25 50Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/></svg>`,
        color: '#8F9E8B'
    }
}

// Additional tag mappings to icons
const tagToCategory: Record<string, string> = {
    // Work
    'praca': 'praca',
    'biznes': 'praca',
    'firma': 'praca',
    'spotkanie': 'spotkanie',
    'meeting': 'spotkanie',
    'zespół': 'spotkanie',
    'projekt': 'projekt',
    'zadanie': 'projekt',
    'deadline': 'projekt',

    // Ideas
    'pomysł': 'pomysł',
    'idea': 'pomysł',
    'inspiracja': 'pomysł',
    'kreatywność': 'kreatywność',
    'twórczość': 'kreatywność',
    'sztuka': 'kreatywność',

    // Nature
    'natura': 'natura',
    'przyroda': 'natura',
    'las': 'natura',
    'palma': 'palma',
    'tropiki': 'palma',
    'wakacje': 'palma',
    'monstera': 'monstera',
    'rośliny': 'monstera',

    // Emotions
    'radość': 'radość',
    'szczęście': 'radość',
    'humor': 'radość',
    'spokój': 'spokój',
    'relaks': 'spokój',
    'medytacja': 'spokój',

    // Personal
    'osobiste': 'osobiste',
    'prywatne': 'osobiste',
    'notatka': 'osobiste',
    'zdrowie': 'zdrowie',
    'sport': 'zdrowie',
    'ćwiczenia': 'zdrowie',

    // Voice
    'voice-memo': 'spokój',
    'głos': 'spokój',
}

export function getIllustrationForTags(tags: string[]): IllustrationData {
    if (!tags || tags.length === 0) {
        return categoryIcons['default']
    }

    // Find the first matching tag
    for (const tag of tags) {
        const normalizedTag = tag.toLowerCase().trim()
        const category = tagToCategory[normalizedTag]
        if (category && categoryIcons[category]) {
            return categoryIcons[category]
        }
    }

    // Use first tag's first letter to pick a color if no match
    const firstTag = tags[0].toLowerCase()
    const colorIndex = firstTag.charCodeAt(0) % Object.keys(categoryIcons).length
    const colors = ['#8F9E8B', '#C98B70', '#D4A84B', '#B8A9C9', '#7A9E8B']

    return {
        svg: categoryIcons['default'].svg,
        color: colors[colorIndex % colors.length]
    }
}

export function NoteIllustration({ tags, size = 60 }: { tags: string[], size?: number }) {
    const illustration = getIllustrationForTags(tags)

    return (
        <div
            style={{
                width: size,
                height: size,
                color: illustration.color,
            }}
            dangerouslySetInnerHTML={{ __html: illustration.svg }}
        />
    )
}
