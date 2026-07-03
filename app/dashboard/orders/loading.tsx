export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="space-y-2 rounded-lg border p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted/70" />
        ))}
      </div>
    </div>
  );
}
