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
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <label>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "0.4rem",
            }}
          >
            Sprache
          </span>

          <select
            value={language}
            onChange={(event) => void handleLanguageChange(event.target.value)}
            disabled={loading || languages.length === 0}
            style={{
              width: "100%",
              padding: "0.65rem",
              fontSize: "1rem",
            }}
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "0.4rem",
            }}
          >
            Buch
          </span>

          <select
            value={book}
            onChange={(event) => void handleBookChange(event.target.value)}
            disabled={loading || books.length === 0}
            style={{
              width: "100%",
              padding: "0.65rem",
              fontSize: "1rem",
            }}
          >
            {books.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: "0.4rem",
            }}
          >
            Kapitel
          </span>

          <select
            value={chapter}
            onChange={(event) => void handleChapterChange(event.target.value)}
            disabled={loading || chapters.length === 0}
            style={{
              width: "100%",
              padding: "0.65rem",
              fontSize: "1rem",
            }}
          >
            {chapters.map((item) => (
              <option key={`${item.kapitel}-${item.chapter}`} value={item.chapter}>
                {item.chapter || `Kapitel ${item.kapitel}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p style={{ marginBottom: "1rem" }}>Daten werden geladen …</p>}

      {error && (
        <p
          style={{
            color: "#b00020",
            marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <div>
          <h2>
            {book}
            {chapter ? ` – ${chapter}` : ""}
          </h2>

          <p>Es wurden {vocs.length} Vokabeln gefunden.</p>

          {vocs.length === 0 ? (
            <p>Für diese Auswahl sind keine Vokabeln vorhanden.</p>
          ) : (
            <div
              style={{
                marginTop: "1.5rem",
                display: "grid",
                gap: "1rem",
              }}
            >
              {vocs.map((voc) => (
                <article
                  key={voc.id}
                  style={{
                    border: "1px solid #cccccc",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {voc.artikel ? `${voc.artikel} ` : ""}
                    {voc.wort}
                  </h3>

                  <p>
                    <strong>Übersetzung:</strong> {voc.uebersetzung}
                  </p>

                  {voc.aussprache && (
                    <p>
                      <strong>Aussprache:</strong> {voc.aussprache}
                    </p>
                  )}

                  {voc.beispielsatz && (
                    <div
                      style={{
                        marginTop: "0.8rem",
                        paddingTop: "0.8rem",
                        borderTop: "1px solid #eeeeee",
                      }}
                    >
                      <p>{voc.beispielsatz}</p>

                      {voc.beispielsatzuebersetzung && (
                        <p
                          style={{
                            color: "#555555",
                          }}
                        >
                          {voc.beispielsatzuebersetzung}
                        </p>
                      )}
                    </div>
                  )}

                  {voc.eigenerKommentar && (
                    <p>
                      <strong>Kommentar:</strong> {voc.eigenerKommentar}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
