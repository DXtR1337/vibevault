'use server'

import { supabase } from '@/lib/supabase'
import { processNote, generateAnswer, generateEmbedding, transcribeAudio, generateNoteIllustration } from '@/lib/ai'
import { revalidatePath } from 'next/cache';

export async function createNote(formData: FormData) {
    const content = formData.get('content') as string;
    const userTagsString = formData.get('tags') as string;
    const file = formData.get('image') as File | null;

    if (!content && !file) {
        return { error: 'Content or image is required' }
    }

    const userTags = userTagsString ? userTagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

    let imageBase64: string | undefined;
    let mimeType: string | undefined;
    let publicUrl: string | null = null;

    try {
        // 1. Upload Image to Supabase Storage if exists
        if (file && file.size > 0 && file.name !== 'undefined') {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return { error: 'Failed to upload image' };
            }

            const { data: { publicUrl: url } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filePath);

            publicUrl = url;

            // Prepare for Gemini
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            imageBase64 = buffer.toString('base64');
            mimeType = file.type;
        }

        // 2. Process with AI (passing image if exists)
        const aiData = await processNote(content || "Image Note", imageBase64, mimeType);

        // Merge user provided tags with AI generated tags (deduplicated)
        const finalTags = Array.from(new Set([...userTags, ...aiData.tags]));

        // 3. Generate unique SVG illustration for this note
        const illustrationSvg = await generateNoteIllustration(
            aiData.title,
            content || "Image Note",
            finalTags
        );

        // 4. Save to DB
        const { data, error } = await supabase
            .from('notes')
            .insert([
                {
                    content: content || (imageBase64 ? "Image uploaded" : ""),
                    title: aiData.title,
                    tags: finalTags,
                    sentiment: aiData.sentiment,
                    embedding: aiData.embedding.length > 0 ? aiData.embedding : null,
                    image_url: publicUrl,
                    illustration_svg: illustrationSvg // Save AI-generated SVG
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return { error: error.message }
        }

        revalidatePath('/dashboard');
        return { success: true, data }
    } catch (err) {
        console.error('Unexpected error:', err)
        return { error: 'An unexpected error occurred' }
    }
}

export async function getNotes() {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching notes:', error)
        return []
    }

    return data
}

export async function getMoodStats() {
    const { data, error } = await supabase
        .from('notes')
        .select('sentiment');

    if (error) {
        console.error('Error fetching mood stats:', error);
        return [];
    }

    // Aggregate sentiment counts
    const stats = data.reduce((acc: any, note: any) => {
        const sentiment = note.sentiment || 'Unknown';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});

    return Object.keys(stats).map(name => ({ name, value: stats[name] }));
}

export async function chatWithVault(query: string) {
    try {
        // 1. Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        if (!queryEmbedding || queryEmbedding.length === 0) {
            return { answer: "I couldn't process your question (embedding failed)." };
        }

        // 2. Search for similar notes
        const { data: notes, error } = await supabase.rpc('match_notes', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3, // Lower threshold to catch more potential matches
            match_count: 10 // Increase context window
        });

        if (error) {
            console.error('Error matching notes:', error);
            return { answer: "Wystąpił błąd podczas przeszukiwania notatek." };
        }

        // 3. Construct prompt
        const context = notes?.map((n: any) => `Tytuł: ${n.title}\nTreść: ${n.content}`).join('\n\n---\n\n') || "Brak pasujących notatek.";

        const prompt = `
SYSTEM: Jesteś VibeVault AI - inteligentnym, analitycznym asystentem. Nie bądź "korpo-botem", bądź bystrym analitykiem. Twoim celem jest ZROZUMIENIE intencji użytkownika i udzielenie odpowiedzi na podstawie notatek.

INSTRUKCJE SPECJALNE:
1. LICZENIE: Jeśli użytkownik pyta "ile notatek...", "ile razy..." lub używa skrótu typu "ile ma...", TWOIM ZADANIEM JEST POLICZYĆ wystąpienia w poniższym KONTEKŚCIE. Masz tekst notatek przed oczami - policz je i podaj konkretną liczbę (np. "Znalazłem 3 notatki..."). Nie mów "nie mam statystyk" - Ty je tworzysz!
2. WNIOSKOWANIE: Jeśli pytanie jest nieprecyzyjne, domyśl się o co chodzi z kontekstu. Nie czepiaj się słówek.
3. KONTEKST to PRAWDA: Twoja wiedza pochodzi tylko z poniższych notatek. Ignoruj błędy "Voice Transcription Failed" chyba że pytanie ich dotyczy.
4. STYL: Konkretny, pomocny, po polsku.

KONTEKST (NOTATKI UŻYTKOWNIKA):
========================================
${context}
========================================

PYTANIE UŻYTKOWNIKA:
"${query}"
`;

        // 4. Generate answer
        const answer = await generateAnswer(prompt);

        return { answer };
    } catch (err) {
        console.error('Chat error:', err);
        return { answer: "An unexpected error occurred." };
    }
}

export async function generateWeeklyScript() {
    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('title, content, created_at')
            // Filter for last 7 days (optional, for now taking recent 20 to ensure context)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error || !notes || notes.length === 0) {
            return { error: "Brak notatek z tego tygodnia." };
        }

        const context = notes.map(n => `[${n.title}]: ${n.content}`).join('\n\n');

        const prompt = `
      Jesteś charyzmatycznym prowadzącym podcast o nazwie "Tydzień z VibeVault". 
      Twoim zadaniem jest podsumowanie notatek użytkownika z ostatniego czasu w formie krótkiego, 1-2 minutowego wejścia radiowego.
      
      Zasady:
      1. Mów luźno, energicznie, jak youtuber lub podcaster.
      2. Odnoś się do "Twoich notatek" i "Twoich pomysłów".
      3. Znajdź ciekawe powiązania między notatkami.
      4. Nie czytaj notatek słowo w słowo - opowiadaj o nich.
      5. Pisz wyłącznie tekst do przeczytania (bez nagłówków typu "Część 1", bez emotikon, które lektor mógłby dziwnie przeczytać).
      6. Język: POLSKI.
      
      Notatki do omówienia:
      ${context}
    `;

        const script = await generateAnswer(prompt);

        return { script };
    } catch (err) {
        console.error(err);
        return { error: "Nie udało się wygenerować podcastu." };
    }
}

export async function deleteNote(id: string) {
    try {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting note:', error);
            return { error: error.message };
        }

        revalidatePath('/dashboard');
        return { success: true };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: 'An unexpected error occurred' };
    }
}

export async function updateNote(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tagsString = formData.get('tags') as string;

    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

    try {
        const { error } = await supabase
            .from('notes')
            .update({ title, content, tags })
            .eq('id', id);

        if (error) {
            console.error('Error updating note:', error);
            return { error: error.message };
        }

        revalidatePath('/dashboard');
        revalidatePath('/brain');
        return { success: true };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: 'An unexpected error occurred' };
    }
}

export async function createVoiceNote(formData: FormData) {
    const file = formData.get('audio') as File | null;

    if (!file) {
        return { error: 'No audio file provided' };
    }

    try {
        let audioUrl: string | null = null;

        // 1. Upload Audio to Supabase Storage
        if (file && file.size > 0) {
            const fileExt = file.name.split('.').pop() || 'webm';
            const fileName = `voice-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Audio upload error:', uploadError);
                // We typically continue even if upload fails, but let's log it.
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(filePath);
                audioUrl = publicUrl;
            }
        }

        // 2. Process with Gemini
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const audioBase64 = buffer.toString('base64');
        const mimeType = file.type || 'audio/webm';

        console.log("--- DEBUG AUDIO UPLOAD ---");
        console.log("File Name:", file.name);
        console.log("File Type (from FormData):", file.type);
        console.log("MimeType used:", mimeType);
        console.log("File Size (bytes):", file.size);
        console.log("Base64 String Length:", audioBase64.length);
        console.log("Base64 Preview:", audioBase64.substring(0, 50));
        console.log("--------------------------");

        // Use the updated structure (inlineData) inside transcribeAudio
        const aiData = await transcribeAudio(audioBase64, mimeType);

        // Generate embedding only if content is valid, otherwise empty
        const embedding = aiData.tags.includes('error') ? [] : await generateEmbedding(aiData.content);

        // 3. Save Note
        const { data, error } = await supabase
            .from('notes')
            .insert([
                {
                    content: aiData.content,
                    title: aiData.title,
                    tags: Array.from(new Set([...aiData.tags, 'voice-memo'])),
                    sentiment: aiData.sentiment,
                    embedding: embedding.length > 0 ? embedding : null,
                    image_url: audioUrl // Save Audio URL in image_url column for now
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return { error: error.message };
        }

        revalidatePath('/dashboard');
        revalidatePath('/brain');
        return { success: true, data };

    } catch (err) {
        console.error('Voice note error:', err);
        return { error: 'Failed to process voice note' };
    }
}

export async function getRecallNote() {
    try {
        // 1. Get stats to determine range. 
        // For simplicity/performance, we'll just fetch a batch of older notes.
        // In a real app with large DB, we'd use random offset or RPC.

        // Define "old" as > 7 days. If not enough, take any > 1 day.
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let { data: notes, error } = await supabase
            .from('notes')
            .select('id, title, content, created_at')
            .lt('created_at', sevenDaysAgo.toISOString())
            .limit(50); // Get a pool of candidate notes

        if (error) throw error;

        // Fallback: if no old notes, get any notes older than 1 day
        if (!notes || notes.length === 0) {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const result = await supabase
                .from('notes')
                .select('id, title, content, created_at')
                .lt('created_at', oneDayAgo.toISOString())
                .limit(20);

            notes = result.data;
        }

        // Deep Fallback: Just get any recent notes if really new user
        if (!notes || notes.length === 0) {
            const result = await supabase
                .from('notes')
                .select('id, title, content, created_at')
                .limit(10);
            notes = result.data;
        }

        if (!notes || notes.length === 0) {
            return null; // No notes at all
        }

        // 2. Pick random note
        const randomNote = notes[Math.floor(Math.random() * notes.length)];

        // 3. Generate Question
        // We import dynamically to avoid circular deps if any (safe here though)
        const { generateRecallQuestion } = await import('@/lib/ai');
        const question = await generateRecallQuestion(randomNote.content);

        return {
            noteId: randomNote.id,
            noteTitle: randomNote.title || "Bez tytułu",
            noteDate: randomNote.created_at,
            question: question
        };

    } catch (err) {
        console.error("Error getting recall note:", err);
        return null;
    }
}
