import { prisma } from "@/lib/prisma";
import VokabelAuswahl from "./VokabelAuswahl";
import { auth } from "@/auth";
export const dynamic = "force-dynamic";

const session = await auth();

if (!session?.user?.id) {
  throw new Error("Kein angemeldeter Benutzer gefunden.");
}

const userId = Number(session.user.id);

export default async function VokabelnPage() {
  /*
   * 0. Angemeldeten Benutzer ermitteln
   *
   * WICHTIG:
   * Hier muss die ID des aktuell angemeldeten Benutzers hinein.
   *
   * Beispiel:
   * const userId = ...
   */
  const userId = 1; // VORLÄUFIG ersetzen durch die ID des eingeloggten Benutzers

  /*
   * Gespeicherte Vokabel-Auswahl des Benutzers laden
   */
  const user = await prisma.userEckiHack.findUnique({
    where: {
      id: userId,
    },
    select: {
      sprache_save: true,
      book_save: true,
      chapter_save: true,
    },
  });

  const savedLanguage = user?.sprache_save ?? "";
  const savedBook = user?.book_save ?? "";
  const savedChapter = user?.chapter_save ?? "";

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
   * Gespeicherte Sprache verwenden,
   * sofern sie noch existiert.
   *
   * Sonst erste vorhandene Sprache verwenden.
   */
  const initialLanguage = savedLanguage && languages.includes(savedLanguage) ? savedLanguage : (languages[0] ?? "");

  /*
   * 2. Bücher der ausgewählten Sprache laden
   */
  const bookRows = initialLanguage
    ? await prisma.vocs.findMany({
        where: {
          sprache: initialLanguage,
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

  /*
   * Gespeichertes Buch verwenden,
   * sofern es innerhalb dieser Sprache existiert.
   *
   * Sonst erstes Buch verwenden.
   */
  const initialBook = savedBook && books.includes(savedBook) ? savedBook : (books[0] ?? "");

  /*
   * 3. Kapitel des ausgewählten Buches laden
   */
  const chapters =
    initialLanguage && initialBook
      ? await prisma.vocs.findMany({
          where: {
            sprache: initialLanguage,
            book: initialBook,
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

  /*
   * Prüfen, ob das gespeicherte Kapitel
   * innerhalb des gewählten Buches noch existiert.
   */
  const savedChapterExists = chapters.some((item) => item.chapter === savedChapter);

  const initialChapter = savedChapter && savedChapterExists ? savedChapter : (chapters[0]?.chapter ?? "");

  /*
   * 4. Vokabeln der gespeicherten bzw.
   * ausgewählten Kombination laden
   */
  const vocs =
    initialLanguage && initialBook && initialChapter
      ? await prisma.vocs.findMany({
          where: {
            sprache: initialLanguage,
            book: initialBook,
            chapter: initialChapter,
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
          initialLanguage={initialLanguage}
          initialBooks={books}
          initialBook={initialBook}
          initialChapters={chapters}
          initialChapter={initialChapter}
          initialVocs={vocs}
        />
      )}
    </main>
  );
}
