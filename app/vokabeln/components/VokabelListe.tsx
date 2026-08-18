"use client";

import { useState } from "react";
import type { Voc } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquareText, Languages } from "lucide-react";

type VokabelListeProps = {
  vocs: Voc[];
};

export default function VokabelListe({ vocs }: VokabelListeProps) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [exampleOpenId, setExampleOpenId] = useState<number | null>(null);
  const [translationOpenId, setTranslationOpenId] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {vocs.map((voc) => (
        <div key={voc.id} className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4">
          {/* Beispielsatz */}
          {voc.beispielsatz && (
            <Popover open={exampleOpenId === voc.id} onOpenChange={(open) => setExampleOpenId(open ? voc.id : null)}>
              <PopoverTrigger className="shrink-0 cursor-none" onMouseEnter={() => setExampleOpenId(voc.id)} onMouseLeave={() => setExampleOpenId(null)}>
                <MessageSquareText className="h-4 w-4 text-muted-foreground" />
              </PopoverTrigger>

              <PopoverContent className="w-auto max-w-sm" onMouseEnter={() => setExampleOpenId(voc.id)} onMouseLeave={() => setExampleOpenId(null)}>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: voc.beispielsatz,
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
          {/* Beispielsatz-Übersetzung */}
          {voc.beispielsatzuebersetzung && (
            <Popover open={translationOpenId === voc.id} onOpenChange={(open) => setTranslationOpenId(open ? voc.id : null)}>
              <PopoverTrigger className="shrink-0 cursor-none" onMouseEnter={() => setTranslationOpenId(voc.id)} onMouseLeave={() => setTranslationOpenId(null)}>
                <Languages className="h-4 w-4 text-muted-foreground" />
              </PopoverTrigger>

              <PopoverContent className="w-auto max-w-sm" onMouseEnter={() => setTranslationOpenId(voc.id)} onMouseLeave={() => setTranslationOpenId(null)}>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: voc.beispielsatzuebersetzung,
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
          {/* Wort + Übersetzung */}
          <Popover open={openId === voc.id} onOpenChange={(open) => setOpenId(open ? voc.id : null)}>
            <PopoverTrigger className="cursor-none text-left font-medium" onMouseEnter={() => setOpenId(voc.id)} onMouseLeave={() => setOpenId(null)}>
              {voc.artikel ? `${voc.artikel} ` : ""}

              <span
                className="wrap-break-word"
                dangerouslySetInnerHTML={{
                  __html: voc.wort,
                }}
              />
            </PopoverTrigger>

            <PopoverContent className="w-auto max-w-xs" onMouseEnter={() => setOpenId(voc.id)} onMouseLeave={() => setOpenId(null)}>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: voc.uebersetzung,
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}
