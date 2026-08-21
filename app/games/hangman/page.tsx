import { prisma } from "@/lib/prisma";
import HangmanGame from "./HangmanGame";
import { randomInt } from "node:crypto";

export const dynamic = "force-dynamic";

export default async function HangmanPage() {
  const vocs = await prisma.vocs.findMany({
    where: {
      book: "Hangman",
    },
    select: {
      id: true,
      wort: true,
      uebersetzung: true,
      chapter: true,
    },
    orderBy: [
      {
        chapter: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  if (vocs.length === 0) {
    return (
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        <h1 className="mb-6 text-3xl font-bold">Hangman</h1>

        <div className="rounded-xl border bg-card p-6">Keine Hangman-Wörter gefunden.</div>
      </main>
    );
  }

  const initialVoc = vocs[randomInt(vocs.length)];

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">Hangman</h1>

      <HangmanGame vocs={vocs} initialVoc={initialVoc} />
    </main>
  );
}
