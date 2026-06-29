export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          FinLedger
        </h1>
        <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400">
          Take control of your finances.
        </p>
      </main>
    </div>
  );
}
