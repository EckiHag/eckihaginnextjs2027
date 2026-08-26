"use client";

import type { Voc } from "../types";

type VokabelEditorProps = {
  editVoc: Voc;
  setEditVoc: React.Dispatch<React.SetStateAction<Voc | null>>;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
};

export default function VokabelEditor({ editVoc, setEditVoc, onSave, onCancel, loading }: VokabelEditorProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border p-4 shadow-sm">
      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90" onClick={onSave} disabled={loading}>
          {loading ? "Speichert …" : "Speichern"}
        </button>

        <button type="button" className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted" onClick={onCancel}>
          Abbrechen
        </button>
      </div>

      {/* ord / art / datum */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label>
          <span className="mb-1 block text-sm font-medium">Reihenfolge</span>
          <input
            type="number"
            value={editVoc.ord}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                ord: Number(event.target.value),
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Art</span>
          <input
            type="text"
            value={editVoc.art}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                art: event.target.value,
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Datum</span>
          <input
            type="date"
            value={editVoc.datum ? new Date(editVoc.datum).toISOString().slice(0, 10) : ""}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                datum: new Date(event.target.value),
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
      </div>

      {/* Sprache / Buch / Kapitel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label>
          <span className="mb-1 block text-sm font-medium">Sprache</span>
          <input
            type="text"
            value={editVoc.sprache}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                sprache: event.target.value,
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Buch</span>
          <input
            type="text"
            value={editVoc.book}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                book: event.target.value,
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium">Kapitel</span>
          <input
            type="text"
            value={editVoc.chapter}
            onChange={(event) =>
              setEditVoc({
                ...editVoc,
                chapter: event.target.value,
              })
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </label>
      </div>

      {/* Artikel / Wort */}
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
  );
}
