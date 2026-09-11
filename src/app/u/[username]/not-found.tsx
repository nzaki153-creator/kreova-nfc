export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-xl font-bold">Profile Not Found</h1>
      <p className="mt-2 text-sm text-kreova-muted">
        Username ini tidak terdaftar di Kreova.
      </p>
      <p className="mt-6 text-xs font-medium tracking-wide text-kreova-muted/50">Kreova</p>
    </main>
  );
}
