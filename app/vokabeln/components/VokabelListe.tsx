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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
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
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex w-full flex-row items-center gap-2">
                {/* Spalte 1: Beispielsatz der Vorderseite */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {frontSentence && (
                    <Popover open={exampleOpenId === voc.id} onOpenChange={(open) => setExampleOpenId(open ? voc.id : null)}>
                      <PopoverTrigger className="cursor-none" onMouseEnter={() => setExampleOpenId(voc.id)} onMouseLeave={() => setExampleOpenId(null)}>
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
                </div>

                {/* Spalte 2: Beispielsatz der Rückseite */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {backSentence && (
                    <Popover open={translationOpenId === voc.id} onOpenChange={(open) => setTranslationOpenId(open ? voc.id : null)}>
                      <PopoverTrigger className="cursor-none" onMouseEnter={() => setTranslationOpenId(voc.id)} onMouseLeave={() => setTranslationOpenId(null)}>
                        <Languages className="h-4 w-4 text-muted-foreground" />
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
                </div>

                {/* Spalte 3: Bearbeiten */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <button type="button" title="Vokabel bearbeiten" onClick={() => onEdit(voc)} className="text-muted-foreground transition hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                {/* Spalte 4: Löschen */}
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <button type="button" title="Vokabel löschen" onClick={() => onDelete(voc)} className="text-muted-foreground transition hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Wort / Übersetzung */}
                <Popover open={openId === voc.id} onOpenChange={(open) => setOpenId(open ? voc.id : null)}>
                  <PopoverTrigger className="cursor-none text-left font-medium" onMouseEnter={() => setOpenId(voc.id)} onMouseLeave={() => setOpenId(null)}>
                    <span
                      className="wrap-break-word"
                      dangerouslySetInnerHTML={{
                        __html: frontWord ?? "",
                      }}
                    />
                  </PopoverTrigger>

                  {/* Rückseite / Übersetzung */}
                  <PopoverContent className="w-auto max-w-xs" onMouseEnter={() => setOpenId(voc.id)} onMouseLeave={() => setOpenId(null)}>
                    <div
                      className="whitespace-pre-line text-sm"
                      dangerouslySetInnerHTML={{
                        __html: backWord ?? "",
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
