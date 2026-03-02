// Simple i18n translations for VibeVault
// Supports Polish (pl) and English (en)

export type Language = 'pl' | 'en'

export const translations = {
    en: {
        // Navigation
        dashboard: 'Dashboard',
        insights: 'Insights',
        brainView: 'Brain View',
        settings: 'Settings',

        // Dashboard
        whatsOnYourMind: "What's on your mind?",
        capture: 'Capture',
        cancel: 'Cancel',
        tagsPlaceholder: 'Tags (comma separated)...',

        // Note Card
        untitled: 'Untitled',
        deleteNote: 'Delete note',

        // Insights
        totalNotes: 'Total Notes',
        thisWeek: 'This Week',
        avgPerDay: 'Avg/Day',
        streak: 'Streak',
        moodDistribution: 'Mood Distribution',
        topTags: 'Top Tags',
        aiWeeklySummary: 'AI Weekly Summary',
        notes: 'notes',
        allTime: 'All time',
        last30Days: 'Last 30 days',
        days: 'days',

        // Settings
        profile: 'Profile',
        appearance: 'Appearance',
        darkMode: 'Dark Mode',
        compactView: 'Compact View',
        reduceAnimations: 'Reduce Animations',
        aiConfiguration: 'AI Configuration',
        language: 'Language',
        notifications: 'Notifications',
        privacyData: 'Privacy & Data',
        exportAllData: 'Export All Data',
        deleteAccount: 'Delete Account',

        // Brain
        brainEmpty: 'Your brain is empty',
        brainEmptyDesc: 'Add some notes in the Dashboard first to see your knowledge graph.',
        goToDashboard: 'Go to Dashboard',
        notesConnected: 'Notes connected',

        // Common
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
    },
    pl: {
        // Navigation
        dashboard: 'Panel główny',
        insights: 'Analityka',
        brainView: 'Widok mózgu',
        settings: 'Ustawienia',

        // Dashboard
        whatsOnYourMind: 'Co masz na myśli?',
        capture: 'Zapisz',
        cancel: 'Anuluj',
        tagsPlaceholder: 'Tagi (oddzielone przecinkami)...',

        // Note Card
        untitled: 'Bez tytułu',
        deleteNote: 'Usuń notatkę',

        // Insights
        totalNotes: 'Wszystkie notatki',
        thisWeek: 'Ten tydzień',
        avgPerDay: 'Średnio/dzień',
        streak: 'Seria',
        moodDistribution: 'Rozkład nastroju',
        topTags: 'Najpopularniejsze tagi',
        aiWeeklySummary: 'Podsumowanie tygodnia AI',
        notes: 'notatek',
        allTime: 'Łącznie',
        last30Days: 'Ostatnie 30 dni',
        days: 'dni',

        // Settings
        profile: 'Profil',
        appearance: 'Wygląd',
        darkMode: 'Tryb ciemny',
        compactView: 'Widok kompaktowy',
        reduceAnimations: 'Ogranicz animacje',
        aiConfiguration: 'Konfiguracja AI',
        language: 'Język',
        notifications: 'Powiadomienia',
        privacyData: 'Prywatność i dane',
        exportAllData: 'Eksportuj dane',
        deleteAccount: 'Usuń konto',

        // Brain
        brainEmpty: 'Twój mózg jest pusty',
        brainEmptyDesc: 'Dodaj notatki w Panelu głównym, aby zobaczyć graf wiedzy.',
        goToDashboard: 'Przejdź do panelu',
        notesConnected: 'Połączonych notatek',

        // Common
        save: 'Zapisz',
        edit: 'Edytuj',
        delete: 'Usuń',
        close: 'Zamknij',
        loading: 'Ładowanie...',
        success: 'Sukces',
        error: 'Błąd',
    }
}

export function t(key: keyof typeof translations['en'], lang: Language = 'pl'): string {
    return translations[lang][key] || translations['en'][key] || key
}
