export default function DesignTestPage() {
  return (
    <main className="min-h-screen space-y-6 bg-background p-8 text-foreground">
      <h1 className="text-3xl font-semibold">Designsystem</h1>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold">Kartenfläche</h2>

        <p className="mt-2 text-muted-foreground">Ein Beispiel für normalen Begleittext.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-hover">Primär</button>

          <button className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary-hover">Sekundär</button>

          <button className="rounded-md bg-success px-4 py-2 text-success-foreground">Erfolg</button>

          <button className="rounded-md bg-warning px-4 py-2 text-warning-foreground">Warnung</button>

          <button className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground">Löschen</button>
        </div>
      </div>
    </main>
  );
}
