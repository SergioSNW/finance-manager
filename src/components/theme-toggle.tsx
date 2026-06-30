"use client";

import { useTheme } from "./theme-provider";

const icons: Record<string, string> = {
  light: "☀️",
  dark: "🌙",
  system: "💻",
};

const next: Record<string, "dark" | "system" | "light"> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(next[theme])}
      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      title={`Theme: ${theme}`}
    >
      {icons[theme]}
    </button>
  );
}
