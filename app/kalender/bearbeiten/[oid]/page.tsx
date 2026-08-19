import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { saveDate } from "../actions";

type KalenderBearbeitenPageProps = {
  params: Promise<{
    oid: string;
  }>;
};

export default async function KalenderBearbeitenPage({ params }: KalenderBearbeitenPageProps) {
  const { oid } = await params;

  const date = await prisma.dates.findUnique({
    where: {
      OID: oid,
    },
  });

  if (!date) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-xl p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/kalender" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted" title="Zurück zum Kalender">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <h1 className="text-2xl font-bold">Kalendertag bearbeiten</h1>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="mb-6">
          <div className="text-xl font-semibold">{date.Datum.toLocaleDateString("de-DE")}</div>

          <div className="mt-1 text-sm text-muted-foreground">
            {date.Wochentag}
            {date.Feiertag && ` · ${date.Feiertag}`}
          </div>
        </div>

        <form action={saveDate} className="space-y-5">
          <input type="hidden" name="oid" value={date.OID} />

          <div>
            <label htmlFor="termin" className="mb-2 block text-sm font-medium">
              Termin
            </label>

            <textarea id="termin" name="termin" rows={5} defaultValue={date.Termin} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>

          <div>
            <label htmlFor="ferien" className="mb-2 block text-sm font-medium">
              Ferien
            </label>

            <input id="ferien" name="ferien" defaultValue={date.Ferien} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Speichern
            </button>

            <Link href="/kalender" className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
