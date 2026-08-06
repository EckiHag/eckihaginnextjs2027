import { prisma } from "@/lib/prisma";
import VokabelAuswahl from "./VokabelAuswahl";

export const dynamic = "force-dynamic";

export default async function VokabelnPage() {
  /*
   * 1. Alle vorhandenen Sprachen laden
   */
  const languageRows = await prisma.vocs.findMany({
    where: {
      sprache: {
        not: "",
      },
    },
    select: {
      sprache: true,
    },
    distinct: ["sprache"],
    orderBy: {
      sprache: "asc",
    },
  });

  const languages = languageRows.map((row) => row.sprache);

  /*
   * Die erste Sprache wird als Startwert verwendet.
   */
  const firstLanguage = languages[0] ?? "";

  /*
   * 2. Alle Bücher der ersten Sprache laden
   */
  const bookRows = firstLanguage
    ? await prisma.vocs.findMany({
        where: {
          sprache: firstLanguage,
          book: {
            not: "",
          },
        },
        select: {
          book: true,
        },
        distinct: ["book"],
        orderBy: {
          book: "asc",
        },
      })
    : [];

  const books = bookRows.map((row) => row.book);
  const firstBook = books[0] ?? "";

  /*
   * 3. Alle Kapitel des ersten Buches laden
   */
  const chapters =
    firstLanguage && firstBook
      ? await prisma.vocs.findMany({
          where: {
            sprache: firstLanguage,
            book: firstBook,
            chapter: {
              not: "",
            },
          },
          select: {
            chapter: true,
            kapitel: true,
          },
          distinct: ["chapter", "kapitel"],
          orderBy: {
            kapitel: "asc",
          },
        })
      : [];

  const firstChapter = chapters[0]?.chapter ?? "";

  /*
   * 4. Vokabeln des ersten Kapitels laden
   */
  const vocs =
    firstLanguage && firstBook && firstChapter
      ? await prisma.vocs.findMany({
          where: {
            sprache: firstLanguage,
            book: firstBook,
            chapter: firstChapter,
          },
          orderBy: [
            {
              ord: "asc",
            },
            {
              id: "asc",
            },
          ],
        })
      : [];

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Vokabeln</h1>

      {languages.length === 0 ? (
        <p>In der Datenbank wurden keine Sprachen gefunden.</p>
      ) : (
        <VokabelAuswahl
          initialLanguages={languages}
          initialLanguage={firstLanguage}
          initialBooks={books}
          initialBook={firstBook}
          initialChapters={chapters}
          initialChapter={firstChapter}
          initialVocs={vocs}
        />
      )}
    </main>
  );
}
