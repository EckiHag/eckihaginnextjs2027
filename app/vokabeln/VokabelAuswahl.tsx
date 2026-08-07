"use client";

import { useState } from "react";

type ChapterOption = {
  chapter: string;
  kapitel: number;
};

type Voc = {
  id: number;
  ord: number;
  art: string;
  artikel: string;
  wort: string;
  geschlecht: string;
  aussprache: string;
  uebersetzung: string;
  beispielsatz: string;
  beispielsatzuebersetzung: string;
  eigenerKommentar: string;
  sprache: string;
  book: string;
  chapter: string;
  schwierigkeitsgrad: number;
  kapitel: number;
  kapiteltext: string;
};

type VokabelAuswahlProps = {
  initialLanguages: string[];
  initialLanguage: string;

  initialBooks: string[];
  initialBook: string;

  initialChapters: ChapterOption[];
  initialChapter: string;

  initialVocs: Voc[];
};

type LanguageResponse = {
  books: string[];
  selectedBook: string;
  chapters: ChapterOption[];
  selectedChapter: string;
  vocs: Voc[];
};

type BookResponse = {
  chapters: ChapterOption[];
  selectedChapter: string;
  vocs: Voc[];
};

type ChapterResponse = {
  vocs: Voc[];
};

export default function VokabelAuswahl({ initialLanguages, initialLanguage, initialBooks, initialBook, initialChapters, initialChapter, initialVocs }: VokabelAuswahlProps) {
  const [languages] = useState(initialLanguages);
  const [language, setLanguage] = useState(initialLanguage);

  const [books, setBooks] = useState(initialBooks);
  const [book, setBook] = useState(initialBook);

  const [chapters, setChapters] = useState<ChapterOption[]>(initialChapters);
  const [chapter, setChapter] = useState(initialChapter);

  const [vocs, setVocs] = useState<Voc[]>(initialVocs);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Die Daten konnten nicht geladen werden.");
    }

    return data as T;
  }

  async function saveSelection(language: string, book: string, chapter: string) {
    await fetch("/api/user/save-selection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        book,
        chapter,
      }),
    });
  }

  async function handleLanguageChange(newLanguage: string) {
    try {
      setLoading(true);
      setError("");

      setLanguage(newLanguage);

      /*
       * Die alten untergeordneten Werte werden sofort entfernt.
       */
      setBooks([]);
      setBook("");
      setChapters([]);
      setChapter("");
      setVocs([]);

      const url = `/api/vokabeln?action=sprache` + `&sprache=${encodeURIComponent(newLanguage)}`;

      const data = await fetchJson<LanguageResponse>(url);

      setBooks(data.books);
      setBook(data.selectedBook);

      setChapters(data.chapters);
      setChapter(data.selectedChapter);

      setVocs(data.vocs);
      await saveSelection(newLanguage, data.selectedBook, data.selectedChapter);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleBookChange(newBook: string) {
    try {
      setLoading(true);
      setError("");

      setBook(newBook);

      /*
       * Bei einem Buchwechsel bleiben Sprache
       * und Bücherliste bestehen.
       *
       * Nur Kapitel und Inhalt werden erneuert.
       */
      setChapters([]);
      setChapter("");
      setVocs([]);

      const url = `/api/vokabeln?action=book` + `&sprache=${encodeURIComponent(language)}` + `&book=${encodeURIComponent(newBook)}`;

      const data = await fetchJson<BookResponse>(url);

      setChapters(data.chapters);
      setChapter(data.selectedChapter);
      setVocs(data.vocs);
      await saveSelection(language, newBook, data.selectedChapter);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleChapterChange(newChapter: string) {
    try {
      setLoading(true);
      setError("");

      setChapter(newChapter);
      setVocs([]);

      const url = `/api/vokabeln?action=chapter` + `&sprache=${encodeURIComponent(language)}` + `&book=${encodeURIComponent(book)}` + `&chapter=${encodeURIComponent(newChapter)}`;

      const data = await fetchJson<ChapterResponse>(url);

      setVocs(data.vocs);
      await saveSelection(language, book, newChapter);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      {/* Auswahlbereich */}
      <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm sm:p-5 lg:mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Sprache */}
          <label className="block min-w-0">
            <span className="mb-1.5 block text-sm font-semibold sm:text-base">Sprache</span>

            <select
              value={language}
              onChange={(event) => void handleLanguageChange(event.target.value)}
              disabled={loading || languages.length === 0}
              className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Buch */}
          <label className="block min-w-0">
            <span className="mb-1.5 block text-sm font-semibold sm:text-base">Buch</span>

            <select
              value={book}
              onChange={(event) => void handleBookChange(event.target.value)}
              disabled={loading || books.length === 0}
              className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {books.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Kapitel */}
          <label className="block min-w-0 md:col-span-2 lg:col-span-1">
            <span className="mb-1.5 block text-sm font-semibold sm:text-base">Kapitel</span>

            <select
              value={chapter}
              onChange={(event) => void handleChapterChange(event.target.value)}
              disabled={loading || chapters.length === 0}
              className="w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chapters.map((item) => (
                <option key={`${item.kapitel}-${item.chapter}`} value={item.chapter}>
                  {item.chapter || `Kapitel ${item.kapitel}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Ladeanzeige */}
      {loading && <div className="mb-4 rounded-lg bg-muted p-4 text-sm sm:text-base">Daten werden geladen …</div>}

      {/* Fehler */}
      {error && <div className="mb-4 rounded-lg border border-red-600 bg-red-50 p-4 text-sm text-red-800 sm:text-base">{error}</div>}

      {!loading && !error && (
        <>
          {/* Überschrift */}
          <div className="mb-5 sm:mb-6">
            <h2 className="break-words text-xl font-bold sm:text-2xl">
              {book}
              {chapter ? ` – ${chapter}` : ""}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {vocs.length} {vocs.length === 1 ? "Datensatz" : "Datensätze"}
            </p>
          </div>

          {vocs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground sm:p-6 sm:text-base">
              Für diese Auswahl sind keine Datensätze vorhanden.
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {vocs.map((voc) => (
                <article key={voc.id} className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                  {/* Kopf */}
                  <div className="mb-3 flex min-w-0 items-start justify-between gap-4 sm:mb-4">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold sm:text-xl">
                        {voc.artikel ? `${voc.artikel} ` : ""}
                        {voc.wort}
                      </h3>
                    </div>
                  </div>

                  {/* Grunddaten */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{/* Hier können später weitere Felder stehen */}</div>

                  {/* Beispielsatz */}
                  {voc.beispielsatz && (
                    <div className="mt-4 overflow-hidden rounded-lg bg-muted p-3 sm:mt-5 sm:p-4">
                      <div
                        className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                        dangerouslySetInnerHTML={{
                          __html: voc.beispielsatz,
                        }}
                      />

                      {voc.beispielsatzuebersetzung && (
                        <>
                          <div className="my-3 border-t border-border" />

                          <div
                            className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                            dangerouslySetInnerHTML={{
                              __html: voc.beispielsatzuebersetzung,
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
