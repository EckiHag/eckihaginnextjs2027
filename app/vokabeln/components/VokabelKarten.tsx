import type { Voc } from "../types";
import VokabelEditor from "./VokabelEditor";
import { Trash2 } from "lucide-react";
type VokabelKartenProps = {
  vocs: Voc[];
  reversed: boolean;
  editingId: number | null;
  editVoc: Voc | null;

  setEditVoc: React.Dispatch<React.SetStateAction<Voc | null>>;

  onEdit: (voc: Voc) => void;
  onDelete: (voc: Voc) => void;
  onSave: () => void;
  onCancel: () => void;

  saving: boolean;
};

// return (
//   <div>
//     {[...vocs]
//       .sort((a, b) => Number(a.id) - Number(b.id))
//       .map((voc) => (

export default function VokabelKarten({ vocs, reversed, editingId, editVoc, setEditVoc, onEdit, onDelete, onSave, onCancel, saving }: VokabelKartenProps) {
  return (
    <div>
      {vocs.map((voc) => {
        const frontWord = reversed ? voc.uebersetzung : voc.wort;
        const backWord = reversed ? voc.wort : voc.uebersetzung;

        const frontSentence = reversed ? voc.beispielsatzuebersetzung : voc.beispielsatz;

        const backSentence = reversed ? voc.beispielsatz : voc.beispielsatzuebersetzung;

        return (
          <article key={voc.id} className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
            {/* Kopf Wort */}
            <div className="mb-3 min-w-0 sm:mb-4">
              {editingId === voc.id && editVoc ? (
                <VokabelEditor editVoc={editVoc} setEditVoc={setEditVoc} onSave={onSave} onCancel={onCancel} loading={saving} />
              ) : (
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row-reverse sm:items-start sm:justify-between sm:gap-4">
                  {/* Wort */}
                  <div className="w-full min-w-0 text-right sm:w-auto sm:flex-1">
                    <div className="group relative inline-block">
                      <h3 className="wrap-break-words cursor-help text-lg font-bold sm:text-xl">
                        {!reversed && voc.artikel ? `${voc.artikel} ` : ""}

                        <span
                          dangerouslySetInnerHTML={{
                            __html: frontWord ?? "",
                          }}
                        />
                      </h3>

                      {/* Tooltip mit Übersetzung */}
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden w-max max-w-xs whitespace-pre-line rounded-md border bg-popover px-3 py-2 text-sm font-normal text-popover-foreground shadow-md group-hover:block"
                      >
                        {reversed && voc.artikel ? `${voc.artikel} ${backWord}` : backWord}
                      </div>
                    </div>
                  </div>

                  {/* Kopf Buttons */}
                  <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:shrink-0">
                    {`${voc.ord} / ${voc.id}`}

                    <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted" onClick={() => onEdit(voc)}>
                      Bearbeiten
                    </button>

                    <button
                      type="button"
                      title="Vokabel löschen"
                      onClick={() => onDelete(voc)}
                      className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <a
                      href={`https://es-de.dict.cc/?s=${encodeURIComponent(voc.wort.trim())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wort bei dict.cc nachschlagen"
                      className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      dict.cc
                    </a>

                    <a
                      href={`https://dict.leo.org/spanisch-deutsch/${encodeURIComponent(voc.wort.trim())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Wort bei LEO nachschlagen"
                      className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                    >
                      LEO
                    </a>

                    {voc.beispielsatz?.trim() && (
                      <a
                        href={`https://translate.google.com/?sl=auto&tl=de&text=${encodeURIComponent(voc.beispielsatz.trim())}&op=translate`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Beispielsatz ins Deutsche übersetzen"
                        aria-label="Beispielsatz mit Google Übersetzer ins Deutsche übersetzen"
                        className="rounded-lg border border-border p-2 text-muted-foreground transition hover:bg-muted"
                      >
                        GoogÜb
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Grunddaten */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{/* Hier können später weitere Felder stehen */}</div>

            {/* Beispielsatz und Übersetzung */}
            {(frontSentence || backSentence) && (
              <div className="mt-4 overflow-hidden rounded-lg bg-muted p-3 sm:mt-5 sm:p-4">
                {/* Vorderer Beispielsatz */}
                {frontSentence && (
                  <div
                    className="whitespace-pre-line wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                    dangerouslySetInnerHTML={{
                      __html: frontSentence,
                    }}
                  />
                )}

                {/* Trennlinie */}
                {frontSentence && backSentence && <div className="my-3 border-t border-border" />}

                {/* Hinterer Beispielsatz */}
                {backSentence && (
                  <div
                    className="whitespace-pre-line wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                    dangerouslySetInnerHTML={{
                      __html: backSentence,
                    }}
                  />
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
