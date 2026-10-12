"use client";

import { useState } from "react";
import type { Voc } from "../types";

type VokabelUebenProps = {
  vocs: Voc[];
};

export default function VokabelUeben({ vocs }: VokabelUebenProps) {
  const [karten, setKarten] = useState<Voc[]>([]);
  const [index, setIndex] = useState(0);
  const [umgedreht, setUmgedreht] = useState(false);
  const [gestartet, setGestartet] = useState(false);

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
  }

  function weiter() {
    setIndex((vorher) => vorher + 1);
    setUmgedreht(false);
  }

  if (vocs.length === 0) {
    return <p className="p-6 text-center text-slate-500">Keine Vokabeln zum Üben vorhanden.</p>;
  }

  if (!gestartet) {
    return (
      <div className="mx-auto max-w-xl space-y-5 p-6 text-center">
        <h2 className="text-2xl font-bold">Vokabeln üben</h2>

        <p className="text-slate-600">{vocs.length} Vokabeln stehen bereit. Überlege dir die Übersetzung und drehe dann die Karte um.</p>

        <button type="button" onClick={starten} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Üben starten
        </button>
      </div>
    );
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

  return (
    <div className="mx-auto max-w-xl space-y-5 p-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Karte {index + 1} von {karten.length}
        </span>

        <button type="button" onClick={starten} className="font-medium text-blue-600 hover:underline">
          Neu mischen
        </button>
      </div>

      <button
        type="button"
        onClick={() => setUmgedreht((vorher) => !vorher)}
        aria-label={umgedreht ? "Wort anzeigen" : "Übersetzung anzeigen"}
        className={`flex h-80 w-full flex-col overflow-hidden
    rounded-2xl border-2 p-6 text-center shadow-md
    transition-colors focus-visible:outline-2
    focus-visible:outline-offset-4 focus-visible:outline-blue-600
    ${umgedreht ? "border-green-300 bg-green-50" : "border-blue-200 bg-white hover:bg-blue-50"}`}
      >
        <span className="shrink-0 text-sm font-medium uppercase tracking-wide text-slate-500">{umgedreht ? "Übersetzung" : "Vokabel"}</span>

        <span className="my-4 flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
          <span className="my-auto flex w-full shrink-0 flex-col gap-5">
            <span className="wrap-break-word text-3xl font-bold text-slate-900">{umgedreht ? voc.uebersetzung : wort}</span>

            <span className="wrap-break-wordtext-base leading-relaxed text-slate-600">{umgedreht ? voc.beispielsatzuebersetzung : voc.beispielsatz}</span>
          </span>
        </span>

        <span className="shrink-0 text-sm text-slate-500">Zum Umdrehen klicken</span>
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onMouseEnter={() => setUmgedreht(true)}
          onMouseLeave={() => setUmgedreht(false)}
          onFocus={() => setUmgedreht(true)}
          onBlur={() => setUmgedreht(false)}
          className="w-1/2 flex-none rounded-xl border border-slate-300
    px-3 py-2 text-sm font-semibold hover:bg-slate-100"
        >
          {umgedreht ? "Wort anzeigen" : "Übersetzung anzeigen"}
        </button>

        <button type="button" onClick={weiter} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          {index === karten.length - 1 ? "Abschließen" : "Weiter →"}
        </button>
      </div>
    </div>
  );
}
