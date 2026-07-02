import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { IconDashboard, IconAccounts, IconTransactions, IconBudgets, IconHoldings, IconCategories } from "./icons";

const links = [
  { href: "/", label: "Dashboard", icon: IconDashboard },
  { href: "/accounts", label: "Accounts", icon: IconAccounts },
  { href: "/transactions", label: "Transactions", icon: IconTransactions },
  { href: "/budgets", label: "Budgets", icon: IconBudgets },
  { href: "/holdings", label: "Holdings", icon: IconHoldings },
  { href: "/categories", label: "Categories", icon: IconCategories },
];

export function Nav() {
  return (
    <nav className="flex w-full flex-col border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:w-56 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-3 lg:px-5 lg:py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          FinLedger
        </Link>
          <div>
            <ThemeToggle />
          </div>
      </div>
      <div className="flex flex-wrap gap-1.5 px-2 pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-3 lg:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
