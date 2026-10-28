"use client";

import { useState } from "react";
import type { Voc } from "../types";
import { MessageSquareText, Languages, Pencil, Trash2 } from "lucide-react";
import VokabelEditor from "./VokabelEditor";

type VokabelListeProps = {
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

type TooltipTyp = "frontSentence" | "backSentence" | "backWord" | null;

export default function VokabelListe({ vocs, reversed, editingId, editVoc, setEditVoc, onEdit, onDelete, onSave, onCancel, saving }: VokabelListeProps) {
  const [tooltipId, setTooltipId] = useState<number | null>(null);
  const [tooltipTyp, setTooltipTyp] = useState<TooltipTyp>(null);

  function openTooltip(id: number, typ: Exclude<TooltipTyp, null>) {
    setTooltipId(id);
    setTooltipTyp(typ);
  }

  function closeTooltip() {
    setTooltipId(null);
    setTooltipTyp(null);
  }

  return (
    <div className="ml-auto w-full overflow-hidden rounded-xl border border-border bg-card">
      {vocs.map((voc) => {
        /*
         * Fremdsprachenwort einschließlich Artikel.
         * Der Artikel gehört immer zum Fremdsprachenwort.
         */
        const fremdwort = [voc.artikel, voc.wort].filter(Boolean).join(" ");

        /*
         * Vorder- und Rückseite abhängig von der Lernrichtung.
         */
        const frontWord = reversed ? voc.uebersetzung : fremdwort;

        const backWord = reversed ? fremdwort : voc.uebersetzung;

        const frontSentence = reversed ? voc.beispielsatzuebersetzung : voc.beispielsatz;

        const backSentence = reversed ? voc.beispielsatz : voc.beispielsatzuebersetzung;

        return (
          <div key={voc.id} className={editingId === voc.id ? "border-b border-border bg-area-blue last:border-b-0" : "border-b border-border last:border-b-0"}>
            {/* Listenzeile */}
            <div className="px-4 py-3">
              <div className="relative ml-auto flex w-full max-w-100 min-w-0 items-center justify-between gap-3">
                {/* LINKS: Wort */}
                <div className="min-w-0 flex-1">
                  <span
                    className="block wrap-break-word text-left font-medium"
                    dangerouslySetInnerHTML={{
                      __html: frontWord ?? "",
                    }}
                  />
                </div>

                {/* RECHTS: Buttons */}
                <div className="flex shrink-0 items-center gap-2">
                  {/* Löschen */}
                  <button
                    type="button"
                    title="Vokabel löschen"
                    onClick={() => onDelete(voc)}
                    className="flex h-5 w-5 items-center justify-center text-muted-foreground transition hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Bearbeiten */}
                  <button
                    type="button"
                    title="Vokabel bearbeiten"
                    onClick={() => onEdit(voc)}
                    className="flex h-5 w-5 items-center justify-center text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* Übersetzung des Beispielsatzes */}
                  {backSentence && (
                    <button
                      type="button"
                      title="Übersetzung des Beispielsatzes"
                      onMouseEnter={() => openTooltip(voc.id, "backSentence")}
                      onMouseLeave={closeTooltip}
                      className="flex h-5 w-5 items-center justify-center text-muted-foreground transition hover:text-foreground"
                    >
                      <MessageSquareText className="h-4 w-4" />
                    </button>
                  )}

                  {/* Beispielsatz */}
                  {frontSentence && (
                    <button
                      type="button"
                      title="Beispielsatz"
                      onMouseEnter={() => openTooltip(voc.id, "frontSentence")}
                      onMouseLeave={closeTooltip}
                      className="flex h-5 w-5 items-center justify-center text-muted-foreground transition hover:text-foreground"
                    >
                      <MessageSquareText className="h-4 w-4" />
                    </button>
                  )}

                  {/* Übersetzung des Wortes */}
                  {backWord && (
                    <button
                      type="button"
                      title="Übersetzung"
                      onMouseEnter={() => openTooltip(voc.id, "backWord")}
                      onMouseLeave={closeTooltip}
                      className="flex h-5 w-5 items-center justify-center text-muted-foreground transition hover:text-foreground"
                    >
                      <Languages className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* GEMEINSAMER TOOLTIP */}
                {tooltipId === voc.id && tooltipTyp && (
                  <div
                    className="absolute left-0 top-full z-50 mt-2 w-max max-w-sm rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md"
                    onMouseEnter={() => setTooltipId(voc.id)}
                    onMouseLeave={closeTooltip}
                  >
                    {/* Beispielsatz */}
                    {tooltipTyp === "frontSentence" && (
                      <div
                        className="whitespace-pre-line text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: frontSentence ?? "",
                        }}
                      />
                    )}

                    {/* Übersetzung des Beispielsatzes */}
                    {tooltipTyp === "backSentence" && (
                      <div
                        className="whitespace-pre-line text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: backSentence ?? "",
                        }}
                      />
                    )}

                    {/* Übersetzung des Wortes */}
                    {tooltipTyp === "backWord" && (
                      <div
                        className="whitespace-pre-line text-sm"
                        dangerouslySetInnerHTML={{
                          __html: backWord ?? "",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Editierbereich */}
            {editingId === voc.id && editVoc && (
              <div className="border-t border-border/50 px-4 pb-4 pt-3">
                <VokabelEditor editVoc={editVoc} setEditVoc={setEditVoc} onSave={onSave} onCancel={onCancel} loading={saving} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
