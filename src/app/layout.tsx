import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ensureDbInitialized } from "@/lib/init";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinLedger",
  description: "Take control of your finances.",
};

const flashScript = `
(function() {
  try {
    var t = localStorage.getItem('finledger-theme') || 'system';
    var d = t === 'dark' ? true : t === 'light' ? false : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (d) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureDbInitialized();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: flashScript }} />
      </head>
      <body className="min-h-full flex">
        <ThemeProvider>
          <Nav />
          <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
