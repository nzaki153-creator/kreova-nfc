export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12">
      <div className="w-full animate-pulse rounded-xl2 border border-kreova-border bg-kreova-card p-8">
        <div className="mx-auto h-28 w-28 rounded-full bg-kreova-surface" />
        <div className="mx-auto mt-5 h-6 w-40 rounded bg-kreova-surface" />
        <div className="mx-auto mt-3 h-4 w-32 rounded bg-kreova-surface" />
        <div className="mx-auto mt-2 h-4 w-28 rounded bg-kreova-surface" />
        <div className="mt-8 space-y-3">
          <div className="h-12 w-full rounded-xl bg-kreova-surface" />
          <div className="h-12 w-full rounded-xl bg-kreova-surface" />
        </div>
      </div>
    </main>
  );
}
