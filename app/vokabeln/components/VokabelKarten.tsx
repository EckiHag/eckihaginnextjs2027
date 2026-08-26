import type { Voc } from "../types";
import VokabelEditor from "./VokabelEditor";

type VokabelKartenProps = {
  vocs: Voc[];
  editingId: number | null;
  editVoc: Voc | null;

  setEditVoc: React.Dispatch<React.SetStateAction<Voc | null>>;

  onEdit: (voc: Voc) => void;
  onSave: () => void;
  onCancel: () => void;

  saving: boolean;
};

export default function VokabelKarten({ vocs, editingId, editVoc, setEditVoc, onEdit, onSave, onCancel, saving }: VokabelKartenProps) {
  return (
    <div>
      {vocs.map((voc) => (
        <article key={voc.id} className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
          {/* Kopf */}
          <div className="mb-3 min-w-0 sm:mb-4">
            {editingId === voc.id && editVoc ? (
              <VokabelEditor editVoc={editVoc} setEditVoc={setEditVoc} onSave={onSave} onCancel={onCancel} loading={saving} />
            ) : (
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="wrap-break-words text-lg font-bold sm:text-xl">
                    {voc.artikel ? `${voc.artikel} ` : ""}

                    <div
                      className="wrap-break-word text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: voc.wort,
                      }}
                    />
                  </h3>
                </div>

                <button type="button" className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted" onClick={() => onEdit(voc)}>
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

              {/* Trennlinie nur, wenn beide vorhanden sind */}
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
