import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Abstract Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100/50 via-purple-100/50 to-pink-100/50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 z-0 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl border-white/20 dark:border-zinc-800 relative z-10 transition-all duration-300 hover:shadow-indigo-500/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">✨</span>
          </div>
          <CardTitle className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            VibeVault
          </CardTitle>
          <CardDescription className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            Secure your vibe. amplify your style.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-4">
          <p className="text-center text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Welcome to the starting point of something extraordinary. 
            Built with Next.js 15, Tailwind, and Shadcn UI.
          </p>
          <Button className="w-full h-12 text-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
            Enter the Vault
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
