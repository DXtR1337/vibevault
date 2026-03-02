<div align="center">

# ✨ VibeVault

### Your AI-Powered Second Brain

**Capture thoughts. Let AI organize them. Rediscover what matters.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini_2.5-AI_Engine-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-D4A84B.svg)](LICENSE)

---

*VibeVault to notatnik nowej generacji — piszesz lub mówisz, a AI robi resztę: generuje tytuł, tagi, analizę sentymentu, ilustrację i embedding semantyczny. Potem możesz rozmawiać ze swoimi notatkami, wizualizować je jako graf wiedzy i słuchać tygodniowego podsumowania w formie podcastu.*

</div>

<br/>

## 🎯 Problem & Solution

Traditional note-taking apps are **digital dumping grounds** — notes go in, but rarely come back out in useful ways.

VibeVault flips this: every note you capture is **instantly enriched by AI** with metadata, connected to your existing knowledge graph, and resurfaces through intelligent recall. It's not just storage — it's an **active thinking partner**.

<br/>

## ⚡ Features

### 📝 Smart Note Capture
- **Text notes** with AI-powered auto-titling, tagging, and sentiment analysis
- **Voice memos** — speak, and Gemini transcribes + analyzes in real-time
- **Image notes** — upload photos and AI extracts context via OCR & visual analysis
- **AI-generated SVG illustrations** — each note gets a unique, thematic mini-artwork

### 🧠 Brain View — Knowledge Graph
- Interactive **node-based visualization** of all your notes (React Flow)
- Notes cluster by **shared tags** — see hidden connections between ideas
- Click any node to open the full note with all its metadata

### 💬 Chat with Your Vault
- **Semantic search** powered by vector embeddings (`text-embedding-004`)
- Ask questions in natural language and get answers **grounded in your own notes**
- Uses Supabase `pgvector` + RPC for fast similarity matching

### 📊 Insights & Analytics
- **Mood distribution** charts — track emotional patterns over time (Recharts)
- **Top tags** analysis — discover what occupies your mind the most
- **Weekly stats** — notes count, streak, daily average

### 🎙️ AI Weekly Podcast
- One-click generation of a **podcast-style weekly summary**
- AI finds connections between notes and narrates them in an engaging style
- Written in Polish, ready to read or feed into TTS

### 🔄 Recall Training
- **Spaced repetition meets journaling** — the app resurfaces old notes as questions
- AI generates targeted recall questions to help you revisit forgotten ideas

### 🌐 Bilingual UI
- Full **Polish** and **English** support with simple i18n system
- All AI prompts operate in Polish for native-quality output

### 🎨 Cozy Design System
- **Warm, paper-like aesthetic** — cream, sage green, terracotta, mustard palette
- Dark mode "Espresso" theme
- Lora (serif) + Nunito (sans-serif) typography
- Subtle texture overlays & smooth micro-animations (Framer Motion)

<br/>

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Server Actions) |
| **Language** | TypeScript 5 |
| **AI Engine** | Google Gemini 3.0 Flash + text-embedding-004 |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **Storage** | Supabase Storage (images, audio) |
| **Styling** | Tailwind CSS 4, tw-animate-css |
| **Components** | Radix UI, shadcn/ui |
| **Visualization** | React Flow (knowledge graph), Recharts (charts) |
| **Animation** | Framer Motion |
| **Fonts** | Lora, Nunito (Google Fonts via next/font) |

<br/>

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Supabase** account ([supabase.com](https://supabase.com))
- **Google AI** API key ([ai.google.dev](https://ai.google.dev))

### 1. Clone & Install

```bash
git clone https://github.com/DXtR1337/vibevault.git
cd vibevault
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

### 3. Set Up Database

Apply the Supabase migrations in order. You can run them via the Supabase SQL Editor or CLI:

```bash
# If using Supabase CLI:
supabase db push
```

The migrations will create:
- `notes` table with columns for content, title, tags, sentiment, embeddings, images, and SVG illustrations
- `pgvector` extension for semantic search
- `match_notes` RPC function for vector similarity queries
- Storage bucket `uploads` for images and audio files
- Row Level Security policies

### 4. Run Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — the vault awaits ✨

<br/>

## 📁 Project Structure

```
vibevault/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (fonts, theme)
│   ├── actions.ts            # Server Actions (CRUD, AI calls)
│   ├── globals.css           # Cozy design system
│   ├── dashboard/            # Main notes dashboard
│   ├── brain/                # Knowledge graph view
│   ├── insights/             # Analytics & stats
│   └── settings/             # User preferences
├── components/
│   ├── AppSidebar.tsx        # Navigation sidebar
│   ├── NoteDetailsSheet.tsx  # Note detail slide-over
│   ├── brain/                # Brain view components
│   ├── charts/               # Chart components
│   ├── dashboard/            # Dashboard components
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── ai.ts                 # Gemini AI integration
│   ├── i18n.ts               # Translations (PL/EN)
│   ├── supabase.ts           # Supabase client
│   ├── illustrations.tsx     # Fallback SVG illustrations
│   ├── theme.tsx             # Theme provider
│   └── utils.ts              # Utility functions
├── public/                   # Static assets & textures
└── supabase/
    └── migrations/           # Database migrations
```

<br/>

## 🔑 Key AI Capabilities

| Feature | Model | Description |
|---------|-------|-------------|
| Note Processing | Gemini 3.0 Flash | Generates title, tags, sentiment from text + images |
| Voice Transcription | Gemini 3.0 Flash | Transcribes audio with full metadata extraction |
| Semantic Search | text-embedding-004 | 768-dim vectors for note similarity matching |
| Chat with Vault | Gemini 3.0 Flash | RAG-style Q&A grounded in user's notes |
| Weekly Podcast | Gemini 3.0 Flash | Podcast-script generation from recent notes |
| Recall Questions | Gemini 3.0 Flash | Spaced-repetition question generation |
| SVG Illustrations | Gemini 3.0 Flash | Unique minimalist artwork per note |

<br/>

## 🗄️ Database Schema

```sql
-- Core table
CREATE TABLE notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT,
  title       TEXT,
  tags        TEXT[],
  sentiment   TEXT,
  embedding   VECTOR(768),
  image_url   TEXT,
  illustration_svg TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Semantic search function
CREATE FUNCTION match_notes(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
) RETURNS TABLE(id UUID, title TEXT, content TEXT, similarity FLOAT)
```

<br/>

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build   # Verify build passes
```

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy 🎉

### Other Platforms

VibeVault is a standard Next.js app — deploy anywhere that supports Node.js 18+ and server-side rendering.

<br/>

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/awesome-thing`)
3. **Commit** your changes (`git commit -m 'Add awesome thing'`)
4. **Push** to the branch (`git push origin feature/awesome-thing`)
5. **Open** a Pull Request

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

**Built with 🌿 and AI by [DXtR1337](https://github.com/DXtR1337)**

*Secure your vibe. Amplify your style.*

</div>