import type { Metadata } from "next";
import { Lora, Nunito } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VibeVault",
  description: "Twój drugi mózg, wzmocniony przez AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${lora.variable} ${nunito.variable} antialiased font-sans transition-colors duration-300`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
