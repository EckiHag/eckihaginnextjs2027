import Link from "next/link";

export default function FreischaltungPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="text-3xl font-bold">Freischaltung ausstehend</h1>

      <p className="mt-4 text-muted-foreground">Dein Konto wartet auf Freischaltung. Sobald es freigeschaltet wurde, kannst du die geschützten Bereiche nutzen.</p>

      <Link href="/" className="mt-6 inline-block font-medium underline">
        Zur Startseite
      </Link>
    </main>
  );
}
