import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
    console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Using Gemini 2.5 Flash - The only model accepting this audio format without 400 errors
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
});

interface NoteMetadata {
    title: string;
    tags: string[];
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
}

export async function generateEmbedding(text: string): Promise<number[]> {
    // If no API key, return empty array
    if (!apiKey) return [];

    try {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return [];
    }
}

export async function generateNoteMetadata(text: string, imageBase64?: string, mimeType?: string): Promise<NoteMetadata> {
    // If no API key, return placeholders
    if (!apiKey) return { title: "Notatka bez tytułu", tags: [], sentiment: 'Neutral' };

    let prompt = `
    Przeanalizuj poniższą notatkę (tekst i opcjonalny obraz).
    WAŻNE: Wszystkie odpowiedzi muszą być PO POLSKU!
    
    1. Wyodrębnij 3-5 odpowiednich tagów PO POLSKU (np. "praca", "pomysły", "spotkanie").
    2. Wygeneruj krótki, opisowy tytuł PO POLSKU (max 5-7 słów).
    3. Określ sentyment notatki: 'Positive', 'Neutral', 'Negative', 'Mixed'.
    
    Zwróć TYLKO poprawny obiekt JSON w następującym formacie:
    {
      "title": "Twój wygenerowany tytuł po polsku",
      "tags": ["tag1", "tag2", "tag3"],
      "sentiment": "Positive" 
    }
    
    Treść notatki:
    "${text}"
  `;

    if (imageBase64) {
        prompt += `\n\n[KONTEKST OBRAZU]: Użytkownik przesłał również obraz. Przeanalizuj zawartość obrazu. 
      Jeśli zawiera tekst (OCR), uwzględnij odpowiednie słowa kluczowe w tagach PO POLSKU. 
      Jeśli to scena wizualna, opisz ją i użyj tego kontekstu dla tytułu i sentymentu.`;
    }

    try {
        const parts: any[] = [prompt];

        if (imageBase64 && mimeType) {
            parts.push({
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent(parts);
        const response = result.response;
        const textResponse = response.text();

        // Clean up potential markdown formatting (```json ... ```)
        const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedText) as NoteMetadata;
    } catch (error) {
        console.error("Error generating note metadata:", error);
        // Fallback on error
        return {
            title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
            tags: [],
            sentiment: 'Neutral'
        };
    }
}

export async function processNote(text: string, imageBase64?: string, mimeType?: string): Promise<{
    title: string;
    tags: string[];
    sentiment: string;
    embedding: number[];
}> {
    const [metadata, embedding] = await Promise.all([
        generateNoteMetadata(text, imageBase64, mimeType),
        generateEmbedding(text + (imageBase64 ? " [Image attached]" : "")), // Embed text + hint of image
    ]);

    return {
        ...metadata,
        embedding,
    };
}

export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<{
    title: string;
    content: string;
    tags: string[];
    sentiment: string;
}> {
    if (!apiKey) return {
        title: "Voice Note Error",
        content: "API Key missing.",
        tags: [],
        sentiment: 'Neutral'
    };

    try {
        // Użyj obiektu File/Blob skonwertowanego na Base64
        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: audioBase64
                }
            },
            {
                text: `
            Jesteś ekspertem od analizy treści. Twoim zadaniem jest transkrypcja i analiza tego nagrania audio.
            
            Wymagania:
            1. Przeanalizuj treść nagrania (nawet jeśli jest krótka lub chaotyczna).
            2. Wygeneruj metadane w formacie JSON.
            
            Szczegóły pól JSON:
            - title: Krótki, chwytliwy i TEMATYCZNY tytuł (np. "Pomysł na biznes", "Lista zakupów", "Wspomnienie z wakacji"). Absolutnie NIE używaj tytułów typu "Notatka głosowa", "Voice Note", "Nagranie". Tytuł musi odnosić się do TREŚCI.
            - content: Pełna transkrypcja w języku polskim, poprawiona interpunkcyjnie.
            - tags: Lista 3-5 tagów (lowercase, bez #).
            - sentiment: Wybierz z: 'Positive', 'Neutral', 'Negative'.

            Jeśli nagranie jest puste lub słychać tylko szum:
            {"title": "Pusta notatka", "content": "(Brak wyraźnej mowy)", "tags": ["szum", "puste"], "sentiment": "Neutral"}

            Zwróć TYLKO czysty obiekt JSON.
            ` }
        ]);

        const response = result.response;
        const text = response.text();

        // Gemini 2.5 often returns markdown JSON
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return JSON.parse(cleanedText);
        } catch (e) {
            // Fallback if model returns plain text
            return {
                title: "Voice Note",
                content: cleanedText,
                tags: ["voice-memo"],
                sentiment: "Neutral"
            };
        }

    } catch (error: any) {
        console.error("Transcribe error:", error);
        return {
            title: "Błąd transkrypcji audio",
            content: `[Błąd transkrypcji audio] Szczegóły: ${error.message || JSON.stringify(error)}`,
            tags: ["error", "voice-memo"],
            sentiment: 'Negative'
        };
    }
}

export async function generateAnswer(prompt: string): Promise<string> {
    if (!apiKey) return "AI API Key is missing.";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error generating answer:", error);
        return `Error details: ${error.message || JSON.stringify(error)}`;
    }
}

export async function generateRecallQuestion(noteContent: string): Promise<string> {
    if (!apiKey) return "Jak tam postępy z tą notatką?";

    const prompt = `
    Jesteś dociekliwym, inteligentnym asystentem.
    Twoim celem jest przypomnienie użytkownikowi o starej notatce i zmotywowanie go do działania lub refleksji.
    
    Treść notatki:
    "${noteContent}"

    Zadanie:
    Na podstawie tej treści, zadaj JEDNO krótkie, bezpośrednie pytanie (max 15 słów).
    Pytanie ma sprawdzić postępy, sprowokować do myślenia lub odświeżyć pamięć.
    Mów w języku POLSKIM.
    
    Przykład dla "Pomysł na startup": "Czy zrobiłeś już pierwszy krok w stronę tego startupu?"
    Przykład dla "Lista zakupów": "Czy udało się kupić wszystko z tej listy?"
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating recall question:", error);
        return "Co słychać w temacie tej notatki?";
    }
}

/**
 * Generate a unique SVG illustration for a note based on its content and tags.
 * Returns SVG code as a string (without <svg> wrapper - just the inner paths).
 */
export async function generateNoteIllustration(
    title: string,
    content: string,
    tags: string[]
): Promise<string> {
    if (!apiKey) {
        return getDefaultIllustration(tags);
    }

    const prompt = `
    Jesteś artystą tworzącym minimalistyczne, ciepłe ilustracje SVG.
    
    Stwórz PROSTĄ ikonę/ilustrację SVG dla tej notatki:
    Tytuł: "${title}"
    Treść: "${content.slice(0, 200)}"
    Tagi: ${tags.join(', ')}
    
    ZASADY:
    1. ViewBox musi być "0 0 100 100"
    2. Użyj TYLKO tych kolorów (ciepła, cozy paleta):
       - #8F9E8B (sage green - główny)
       - #C98B70 (terracotta - akcent)
       - #D4A84B (mustard - podświetlenia)
       - #E8DFD5 (cream - tło/wypełnienie)
    3. Styl: minimalistyczny, flat design, tropikalny/naturalny vibe
    4. Max 5 elementów path/circle/rect
    5. Używaj fill-opacity dla subtelnych efektów
    6. Tematyka powinna pasować do treści notatki (np. liść dla natury, żarówka dla pomysłów, fale dla relaksu)
    
    ZWRÓĆ TYLKO kod SVG (z tagiem <svg>), bez żadnego innego tekstu, bez markdown:
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let svg = response.text().trim();

        // Clean up markdown if present
        svg = svg.replace(/```svg/g, '').replace(/```xml/g, '').replace(/```/g, '').trim();

        // Validate it's actually SVG
        if (!svg.includes('<svg') || !svg.includes('</svg>')) {
            console.warn("AI did not return valid SVG, using fallback");
            return getDefaultIllustration(tags);
        }

        return svg;
    } catch (error) {
        console.error("Error generating illustration:", error);
        return getDefaultIllustration(tags);
    }
}

// Fallback illustrations based on tag categories
function getDefaultIllustration(tags: string[]): string {
    const tagStr = tags.join(' ').toLowerCase();

    if (tagStr.includes('pomysł') || tagStr.includes('idea')) {
        return `<svg viewBox="0 0 100 100" fill="none"><path d="M50 15C35 15 25 28 25 45C25 55 30 62 40 67L40 75C40 80 45 85 50 85C55 85 60 80 60 75L60 67C70 62 75 55 75 45C75 28 65 15 50 15Z" fill="#D4A84B" fill-opacity="0.3" stroke="#D4A84B" stroke-width="2"/><circle cx="50" cy="40" r="8" fill="#D4A84B"/></svg>`;
    }
    if (tagStr.includes('praca') || tagStr.includes('projekt')) {
        return `<svg viewBox="0 0 100 100" fill="none"><rect x="20" y="30" width="60" height="45" rx="5" fill="#8F9E8B" fill-opacity="0.2" stroke="#8F9E8B" stroke-width="2"/><path d="M35 50L45 60L65 40" stroke="#8F9E8B" stroke-width="3" stroke-linecap="round"/></svg>`;
    }
    if (tagStr.includes('natura') || tagStr.includes('rośliny') || tagStr.includes('monstera')) {
        return `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85L50 55M50 55C35 55 20 45 20 30C20 20 30 15 40 15C45 15 50 20 50 25M50 55C65 55 80 45 80 30C80 20 70 15 60 15C55 15 50 20 50 25" fill="#8F9E8B" fill-opacity="0.3" stroke="#8F9E8B" stroke-width="2"/></svg>`;
    }
    if (tagStr.includes('voice') || tagStr.includes('głos') || tagStr.includes('audio')) {
        return `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="30" fill="#C98B70" fill-opacity="0.2"/><path d="M40 35L65 50L40 65Z" fill="#C98B70"/></svg>`;
    }

    // Default tropical leaf
    return `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85L50 50M25 50C25 30 35 15 50 15C65 15 75 30 75 50C75 65 65 75 50 75C35 75 25 65 25 50Z" fill="#8F9E8B" fill-opacity="0.2" stroke="#8F9E8B" stroke-width="2"/></svg>`;
}

