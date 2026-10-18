"use client";

import { useState } from "react";
import type { Voc } from "../types";
import { Eye, RotateCw, ArrowRight, ArrowLeft, Pencil } from "lucide-react";

type VokabelUebenProps = {
  vocs: Voc[];
  onEdit: (voc: Voc) => void;
};

export default function VokabelUeben({ vocs, onEdit }: VokabelUebenProps) {
  const [karten, setKarten] = useState<Voc[]>([]);
  const [index, setIndex] = useState(0);
  const [umgedreht, setUmgedreht] = useState(false);
  const [gestartet, setGestartet] = useState(false);
  const [hoverVorschau, setHoverVorschau] = useState(false);
  const rueckseiteSichtbar = umgedreht || hoverVorschau;

  function starten() {
    // Kopie erstellen, damit die ursprünglichen vocs unverändert bleiben.
    const gemischt = [...vocs];

    // Fisher-Yates: zufällige Reihenfolge ohne Wiederholungen.
    for (let i = gemischt.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      const temp = gemischt[i]!;
      gemischt[i] = gemischt[j]!;
      gemischt[j] = temp;
    }

    setKarten(gemischt);
    setIndex(0);
    setUmgedreht(false);
    setGestartet(true);
    setHoverVorschau(false);
  }

  function weiter() {
    if (!rueckseiteSichtbar) {
      // Zunächst die Übersetzung anzeigen.
      setUmgedreht(true);
      setHoverVorschau(false);
      return;
    }

    // Übersetzung ist bereits sichtbar: nächste Vokabel.
    setIndex((vorher) => vorher + 1);
    setUmgedreht(false);
    setHoverVorschau(false);
  }
  const voc = karten[index];

  if (!voc) {
    return (
      <div className="mx-auto max-w-xl space-y-5 p-6 text-center">
        <h2 className="text-2xl font-bold">Durchgang geschafft!</h2>

        <p className="text-slate-600">Du hast alle {karten.length} Vokabeln durchgesehen.</p>

        <button type="button" onClick={starten} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Neu mischen und noch einmal üben
        </button>
      </div>
    );
  }

  const wort = [voc.artikel, voc.wort].filter(Boolean).join(" ");

  function zurueck() {
    if (karten.length === 0) return;

    setIndex((vorher) => (vorher === 0 ? karten.length - 1 : vorher - 1));

    setUmgedreht(false);
    setHoverVorschau(false);
  }

  return (
    <div className="vokabel-uebung w-full max-w-xl space-y-5 p-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Karte {index + 1} von {karten.length}
        </span>

        <button type="button" onClick={starten} className="font-medium text-blue-600 hover:underline">
          Neu mischen
        </button>
      </div>

      {/* <button
        type="button"
        onClick={() => setUmgedreht((vorher) => !vorher)}
        aria-label={umgedreht ? "Wort anzeigen" : "Übersetzung anzeigen"}
        className={`flex h-80 w-full flex-col overflow-hidden
    rounded-2xl border-2 p-6 text-center shadow-md
    transition-colors focus-visible:outline-2
    focus-visible:outline-offset-4 focus-visible:outline-blue-600
    ${umgedreht ? "border-green-300 bg-green-50" : "border-blue-200 bg-white hover:bg-blue-50"}`}
      > */}
      <div
        className={`relative flex h-80 w-full flex-none flex-col
  overflow-hidden rounded-2xl border-2 py-4 pl-4 pr-16
  shadow-md transition-colors
  ${rueckseiteSichtbar ? "border-green-300 bg-green-50" : "border-blue-200 bg-white"}`}
      >
        {/* Symbolbuttons oben rechts */}
        <div className="absolute right-4 top-4 flex flex-col items-center gap-2">
          <button
            type="button"
            title="Karte umdrehen"
            aria-label="Karte umdrehen"
            aria-pressed={umgedreht}
            onClick={() => setUmgedreht((vorher) => !vorher)}
            className="rounded-lg border border-slate-300 bg-white
        p-2 text-slate-600 hover:bg-blue-100
        focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Vokabel bearbeiten"
            aria-label="Vokabel bearbeiten"
            onClick={() => onEdit(voc)}
            className="rounded-lg border border-slate-300 bg-white
        p-2 text-slate-600 hover:bg-amber-100
        focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            title={!rueckseiteSichtbar ? "Übersetzung anzeigen" : index === karten.length - 1 ? "Durchgang abschließen" : "Nächste Vokabel"}
            aria-label={!rueckseiteSichtbar ? "Übersetzung anzeigen" : index === karten.length - 1 ? "Durchgang abschließen" : "Nächste Vokabel"}
            onClick={weiter}
            className="rounded-lg bg-blue-600 p-2 text-white
        hover:bg-blue-700 focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Vorherige Vokabel"
            aria-label="Vorherige Vokabel"
            onClick={zurueck}
            className="rounded-lg bg-blue-600 p-2 text-white
    hover:bg-blue-700 focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Übersetzung beim Darüberfahren anzeigen"
            aria-label="Übersetzung vorübergehend anzeigen"
            onMouseEnter={() => setHoverVorschau(true)}
            onMouseLeave={() => setHoverVorschau(false)}
            onFocus={() => setHoverVorschau(true)}
            onBlur={() => setHoverVorschau(false)}
            className="rounded-lg border border-slate-300 bg-white
        p-2 text-slate-600 hover:bg-blue-100
        focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Karteninhalt */}
        <div className="mt-3 shrink-0 text-center text-xs font-medium uppercase tracking-wide text-slate-500">{rueckseiteSichtbar ? "Übersetzung" : "Vokabel"}</div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto text-center">
          <div className="flex min-h-full flex-col items-center justify-start  gap-5 px-2 pb-2">
            <div className="w-full whitespace-pre-line wrap-break-word text-2xl font-bold text-slate-900">{rueckseiteSichtbar ? voc.uebersetzung : wort}</div>

            <div className="w-full whitespace-pre-line wrap-break-word text-sm leading-relaxed text-slate-600">
              {rueckseiteSichtbar ? voc.beispielsatzuebersetzung : voc.beispielsatz}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
