import { useState } from "react";

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

type VokabelKartenProps = {
  vocs: Voc[];
  setVocs: React.Dispatch<React.SetStateAction<Voc[]>>;
};

export default function VokabelKarten({ vocs, setVocs }: VokabelKartenProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editVoc, setEditVoc] = useState<Voc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  return (
    <div>
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
  );
}
