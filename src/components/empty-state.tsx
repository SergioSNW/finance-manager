export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-4xl">📭</div>
      <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {action}
    </div>
  );
}
