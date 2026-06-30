import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/accounts", label: "Accounts", icon: "🏦" },
  { href: "/transactions", label: "Transactions", icon: "💳" },
  { href: "/holdings", label: "Holdings", icon: "📈" },
  { href: "/categories", label: "Categories", icon: "🏷️" },
];

export function Nav() {
  return (
    <nav className="flex w-full flex-col border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-3 lg:px-5 lg:py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          FinLedger
        </Link>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex overflow-x-auto px-2 pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-3 lg:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
