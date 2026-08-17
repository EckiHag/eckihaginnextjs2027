"use client";

import { useEffect, useState } from "react";
import { BookOpen, BookMarked, NotebookPen, Languages, Boxes, ScrollText, BookText, Save } from "lucide-react";

const shortcutIcons = {
  BookOpen,
  BookMarked,
  NotebookPen,
  Languages,
  Boxes,
  ScrollText,
  BookText,
};
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

type Shortcut = {
  id: number;
  titel: string;
  sprache: string;
  book: string;
  chapter: string;
  icon: string;
};

type ShortcutResponse = {
  books: string[];
  chapters: ChapterOption[];
  vocs: Voc[];
};

export default function VokabelAuswahl({ initialLanguages, initialLanguage, initialBooks, initialBook, initialChapters, initialChapter, initialVocs }: VokabelAuswahlProps) {
  console.log("VokabelAuswahl wird gerendert");
  const [languages] = useState(initialLanguages);
  const [language, setLanguage] = useState(initialLanguage);

  const [books, setBooks] = useState(initialBooks);
  const [book, setBook] = useState(initialBook);

  const [chapters, setChapters] = useState<ChapterOption[]>(initialChapters);
  const [chapter, setChapter] = useState(initialChapter);

  const [vocs, setVocs] = useState<Voc[]>(initialVocs);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editVoc, setEditVoc] = useState<Voc | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

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

  async function saveVoc() {
    if (!editVoc) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/vokabeln/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editVoc.id,
          artikel: editVoc.artikel,
          wort: editVoc.wort,
          uebersetzung: editVoc.uebersetzung,
          beispielsatz: editVoc.beispielsatz,
          beispielsatzuebersetzung: editVoc.beispielsatzuebersetzung,
          eigenerKommentar: editVoc.eigenerKommentar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Die Vokabel konnte nicht gespeichert werden.");
      }

      setVocs((currentVocs) => currentVocs.map((voc) => (voc.id === data.voc.id ? data.voc : voc)));

      setEditingId(null);
      setEditVoc(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
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

  async function handleShortcutClick(shortcut: Shortcut) {
    try {
      setLoading(true);
      setError("");

      const url =
        `/api/vokabeln?action=shortcut` +
        `&sprache=${encodeURIComponent(shortcut.sprache)}` +
        `&book=${encodeURIComponent(shortcut.book)}` +
        `&chapter=${encodeURIComponent(shortcut.chapter)}`;

      const data = await fetchJson<ShortcutResponse>(url);

      setLanguage(shortcut.sprache);

      setBooks(data.books);
      setBook(shortcut.book);

      setChapters(data.chapters);
      setChapter(shortcut.chapter);

      setVocs(data.vocs);

      await saveSelection(shortcut.sprache, shortcut.book, shortcut.chapter);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Shortcut konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveShortcut(shortcutId: number) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/shortcuts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: shortcutId,
          sprache: language,
          book: book,
          chapter: chapter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Shortcut konnte nicht gespeichert werden.");
      }

      // Shortcut auch im lokalen State aktualisieren
      setShortcuts((currentShortcuts) =>
        currentShortcuts.map((shortcut) =>
          shortcut.id === shortcutId
            ? {
                ...shortcut,
                sprache: language,
                book: book,
                chapter: chapter,
              }
            : shortcut,
        ),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Shortcut konnte nicht gespeichert werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadShortcuts() {
      console.log("1. Shortcut-Fetch startet");

      try {
        console.log("2. Vor fetch");

        const response = await fetch("/api/shortcuts");

        console.log("3. Nach fetch:", response.status);

        if (!response.ok) {
          throw new Error("Shortcuts konnten nicht geladen werden.");
        }

        const data: Shortcut[] = await response.json();

        console.log("4. Daten:", data);

        setShortcuts(data);
      } catch (error) {
        console.error("5. Fehler beim Laden:", error);
      }
    }

    loadShortcuts();
  }, []);

  console.log("Render VokabelAuswahl, shortcuts:", shortcuts);
  return (
    <section className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="rounded-xl border border-border bg-area-blue p-4 shadow-sm sm:p-5">
        {/* Shortcuts */}
        {shortcuts.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {shortcuts.map((shortcut) => {
              const Icon = shortcutIcons[shortcut.icon as keyof typeof shortcutIcons];

              return (
                <div key={shortcut.id} className="flex items-center gap-1">
                  {/* Shortcut aufrufen */}
                  <button
                    type="button"
                    onClick={() => void handleShortcutClick(shortcut)}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 transition hover:bg-muted disabled:opacity-50"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{shortcut.titel}</span>
                  </button>

                  {/* Aktuelle Auswahl in diesem Shortcut speichern */}
                  <button
                    type="button"
                    onClick={() => void handleSaveShortcut(shortcut.id)}
                    disabled={loading}
                    title="Aktuelle Auswahl als Shortcut speichern"
                    className="rounded-lg border border-border p-2.5 transition hover:bg-muted disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
        {/* Auswahlbereich */}
      </div>
      {!loading && !error && (
        <>
          {/* Überschrift */}
          <div className="my-10 mb-5 sm:mb-6">
            <h2 className="wrap-break-words text-xl font-bold sm:text-2xl">
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
                  <div className="mb-3 min-w-0 sm:mb-4">
                    {editingId === voc.id && editVoc ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                            onClick={() => void saveVoc()}
                            disabled={loading}
                          >
                            {loading ? "Speichert …" : "Speichern"}
                          </button>

                          <button
                            type="button"
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                            onClick={() => {
                              setEditingId(null);
                              setEditVoc(null);
                            }}
                          >
                            Abbrechen
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <label>
                            <span className="mb-1 block text-sm font-medium">Artikel</span>
                            <input
                              type="text"
                              value={editVoc.artikel}
                              onChange={(event) =>
                                setEditVoc({
                                  ...editVoc,
                                  artikel: event.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-border bg-background px-3 py-2"
                            />
                          </label>

                          <label>
                            <span className="mb-1 block text-sm font-medium">Wort</span>
                            <input
                              type="text"
                              value={editVoc.wort}
                              onChange={(event) =>
                                setEditVoc({
                                  ...editVoc,
                                  wort: event.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-border bg-background px-3 py-2"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-1 block text-sm font-medium">Übersetzung</span>
                          <input
                            type="text"
                            value={editVoc.uebersetzung}
                            onChange={(event) =>
                              setEditVoc({
                                ...editVoc,
                                uebersetzung: event.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-sm font-medium">Beispielsatz</span>
                          <textarea
                            value={editVoc.beispielsatz}
                            onChange={(event) =>
                              setEditVoc({
                                ...editVoc,
                                beispielsatz: event.target.value,
                              })
                            }
                            rows={4}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-sm font-medium">Übersetzung Beispielsatz</span>
                          <textarea
                            value={editVoc.beispielsatzuebersetzung}
                            onChange={(event) =>
                              setEditVoc({
                                ...editVoc,
                                beispielsatzuebersetzung: event.target.value,
                              })
                            }
                            rows={4}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-sm font-medium">Eigener Kommentar</span>
                          <textarea
                            value={editVoc.eigenerKommentar}
                            onChange={(event) =>
                              setEditVoc({
                                ...editVoc,
                                eigenerKommentar: event.target.value,
                              })
                            }
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="wrap-break-words text-lg font-bold sm:text-xl">
                            {voc.artikel ? `${voc.artikel} ` : ""}
                            {voc.wort}
                          </h3>
                        </div>

                        <button
                          type="button"
                          className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                          onClick={() => {
                            setEditingId(voc.id);
                            setEditVoc({ ...voc });
                          }}
                        >
                          Bearbeiten
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Grunddaten */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{/* Hier können später weitere Felder stehen */}</div>

                  {/* Beispielsatz und/oder Übersetzung */}
                  {(voc.beispielsatz || voc.beispielsatzuebersetzung) && (
                    <div className="mt-4 overflow-hidden rounded-lg bg-muted p-3 sm:mt-5 sm:p-4">
                      {/* Beispielsatz */}
                      {voc.beispielsatz && (
                        <div
                          className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                          dangerouslySetInnerHTML={{
                            __html: voc.beispielsatz,
                          }}
                        />
                      )}

                      {/* Trennlinie nur, wenn BEIDE vorhanden sind */}
                      {voc.beispielsatz && voc.beispielsatzuebersetzung && <div className="my-3 border-t border-border" />}

                      {/* Beispielsatz-Übersetzung */}
                      {voc.beispielsatzuebersetzung && (
                        <div
                          className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                          dangerouslySetInnerHTML={{
                            __html: voc.beispielsatzuebersetzung,
                          }}
                        />
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
