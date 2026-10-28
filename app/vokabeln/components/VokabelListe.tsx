"use client";

import { useState } from "react";
import type { Voc } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

export default function VokabelListe({ vocs, reversed, editingId, editVoc, setEditVoc, onEdit, onDelete, onSave, onCancel, saving }: VokabelListeProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [exampleOpenId, setExampleOpenId] = useState<number | null>(null);
  const [translationOpenId, setTranslationOpenId] = useState<number | null>(null);

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
              <div className="ml-auto flex w-full max-w-80 min-w-0 items-center justify-between gap-3">
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

                  {/* Beispielsatz Rückseite / Übersetzung */}
                  {backSentence && (
                    <Popover open={translationOpenId === voc.id} onOpenChange={(open) => setTranslationOpenId(open ? voc.id : null)}>
                      <PopoverTrigger
                        className="flex h-5 w-5 items-center justify-center cursor-none"
                        onMouseEnter={() => setTranslationOpenId(voc.id)}
                        onMouseLeave={() => setTranslationOpenId(null)}
                        title="Übersetzung des Beispielsatzes"
                      >
                        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                      </PopoverTrigger>

                      <PopoverContent className="w-auto max-w-sm" onMouseEnter={() => setTranslationOpenId(voc.id)} onMouseLeave={() => setTranslationOpenId(null)}>
                        <div
                          className="whitespace-pre-line text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: backSentence,
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* Beispielsatz Vorderseite */}
                  {frontSentence && (
                    <Popover open={exampleOpenId === voc.id} onOpenChange={(open) => setExampleOpenId(open ? voc.id : null)}>
                      <PopoverTrigger
                        className="flex h-5 w-5 items-center justify-center cursor-none"
                        onMouseEnter={() => setExampleOpenId(voc.id)}
                        onMouseLeave={() => setExampleOpenId(null)}
                        title="Beispielsatz"
                      >
                        <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                      </PopoverTrigger>

                      <PopoverContent className="w-auto max-w-sm" onMouseEnter={() => setExampleOpenId(voc.id)} onMouseLeave={() => setExampleOpenId(null)}>
                        <div
                          className="whitespace-pre-line text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: frontSentence,
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* NEU: Übersetzung des Wortes */}
                  {backWord && (
                    <Popover open={openId === voc.id} onOpenChange={(open) => setOpenId(open ? voc.id : null)}>
                      <PopoverTrigger
                        className="flex h-5 w-5 items-center justify-center cursor-none"
                        onMouseEnter={() => setOpenId(voc.id)}
                        onMouseLeave={() => setOpenId(null)}
                        title="Übersetzung"
                      >
                        <Languages className="h-4 w-4 text-muted-foreground" />
                      </PopoverTrigger>

                      <PopoverContent className="w-auto max-w-xs" onMouseEnter={() => setOpenId(voc.id)} onMouseLeave={() => setOpenId(null)}>
                        <div
                          className="whitespace-pre-line text-sm"
                          dangerouslySetInnerHTML={{
                            __html: backWord ?? "",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
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
