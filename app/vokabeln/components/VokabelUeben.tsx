"use client";

import { useState } from "react";
import type { Voc } from "../types";
import { Eye, RotateCw, ArrowRight, ArrowLeft, Pencil, Shuffle } from "lucide-react";

type VokabelUebenProps = {
  vocs: Voc[];
  reversed: boolean;
  sentencesOnly: boolean;
  onEdit: (voc: Voc) => void;
};

type SetModus = "reihenfolge" | "gemischt";

function mischen(vokabeln: Voc[]) {
  const gemischt = [...vokabeln];

  // Fisher-Yates: zufällige Reihenfolge ohne Wiederholungen.
  for (let i = gemischt.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = gemischt[i]!;
    gemischt[i] = gemischt[j]!;
    gemischt[j] = temp;
  }

  return gemischt;
}

export default function VokabelUeben({ vocs, reversed, sentencesOnly, onEdit }: VokabelUebenProps) {
  const [setGroesse, setSetGroesse] = useState(12);
  const [karten, setKarten] = useState<Voc[]>(() => mischen(vocs.slice(0, 12)));
  const [index, setIndex] = useState(0);
  const [umgedreht, setUmgedreht] = useState(false);
  const [hoverVorschau, setHoverVorschau] = useState(false);

  // Lernsets
  const [setModus, setSetModus] = useState<SetModus>("reihenfolge");
  const [aktivesSet, setAktivesSet] = useState<number | "alle">(1);
  const [gemischteGesamtfolge, setGemischteGesamtfolge] = useState<Voc[]>(() => mischen(vocs));

  const rueckseiteSichtbar = umgedreht || hoverVorschau;

  const anzahlSets = Math.ceil(vocs.length / setGroesse);

  /*
   * Liefert die Vokabeln für das gewünschte Set.
   */
  function holeSet(setNummer: number | "alle", modus: SetModus = setModus, gemischteFolge: Voc[] = gemischteGesamtfolge) {
    const quelle = modus === "gemischt" ? gemischteFolge : vocs;

    if (setNummer === "alle") {
      return quelle;
    }

    const start = (setNummer - 1) * setGroesse;
    const ende = start + setGroesse;

    return quelle.slice(start, ende);
  }

  /*
   * Ein bestimmtes Set auswählen.
   */
  function setAuswaehlen(setNummer: number | "alle") {
    const neuesSet = holeSet(setNummer);

    setAktivesSet(setNummer);

    // Innerhalb des ausgewählten Sets zufällig beginnen.
    setKarten(mischen(neuesSet));

    setIndex(0);
    setUmgedreht(false);
    setHoverVorschau(false);
  }

  function setGroesseAendern(neueGroesse: number) {
    setSetGroesse(neueGroesse);

    // Nach Änderung der Setgröße wieder mit Set 1 beginnen.
    setAktivesSet(1);

    const quelle = setModus === "gemischt" ? gemischteGesamtfolge : vocs;

    const erstesSet = quelle.slice(0, neueGroesse);

    setKarten(mischen(erstesSet));
    setIndex(0);
    setUmgedreht(false);
    setHoverVorschau(false);
  }

  /*
   * Zwischen Reihenfolge und gemischten Sets wechseln.
   */
  function modusWechseln(neuerModus: SetModus) {
    if (neuerModus === setModus) return;

    let gemischteFolge = gemischteGesamtfolge;

    if (neuerModus === "gemischt" && gemischteFolge.length === 0) {
      gemischteFolge = mischen(vocs);
      setGemischteGesamtfolge(gemischteFolge);
    }

    setSetModus(neuerModus);

    const neuesSet = holeSet(aktivesSet, neuerModus, gemischteFolge);

    setKarten(mischen(neuesSet));
    setIndex(0);
    setUmgedreht(false);
    setHoverVorschau(false);
  }

  /*
   * Alle geladenen Vokabeln neu mischen und daraus
   * neue 12er-Sets bilden.
   */
  function setsNeuMischen() {
    const neueGesamtfolge = mischen(vocs);

    setGemischteGesamtfolge(neueGesamtfolge);

    const neuesSet = holeSet(aktivesSet, "gemischt", neueGesamtfolge);

    setKarten(mischen(neuesSet));
    setIndex(0);
    setUmgedreht(false);
    setHoverVorschau(false);
  }

  /*
   * Nur die Reihenfolge innerhalb des aktuell
   * ausgewählten Sets neu mischen.
   */
  function aktuellesSetMischen() {
    setKarten((vorher) => mischen(vorher));
    setIndex(0);
    setUmgedreht(false);
    setHoverVorschau(false);
  }

  /*
   * Weiter:
   * 1. Klick zeigt die Rückseite.
   * 2. Klick geht zur nächsten Karte.
   * Nach der letzten Karte beginnt wieder Karte 1.
   */
  function weiter() {
    if (karten.length === 0) return;

    if (!rueckseiteSichtbar) {
      setUmgedreht(true);
      setHoverVorschau(false);
      return;
    }

    setIndex((vorher) => (vorher === karten.length - 1 ? 0 : vorher + 1));

    setUmgedreht(false);
    setHoverVorschau(false);
  }

  /*
   * Rückwärts mit Rundlauf:
   * Von Karte 1 geht es zur letzten Karte.
   */
  function zurueck() {
    if (karten.length === 0) return;

    setIndex((vorher) => (vorher === 0 ? karten.length - 1 : vorher - 1));

    setUmgedreht(false);
    setHoverVorschau(false);
  }

  const voc = karten[index];

  if (vocs.length === 0) {
    return (
      <div className="vokabel-uebung w-full max-w-xl p-4">
        <div className="rounded-xl border border-dashed p-5 text-center text-sm text-slate-500">
          {sentencesOnly ? "Für diese Auswahl sind keine Beispielsätze mit Übersetzung vorhanden." : "Keine Vokabeln zum Üben vorhanden."}
        </div>
      </div>
    );
  }

  if (!voc) {
    return null;
  }

  const fremdwort = [voc.artikel, voc.wort].filter(Boolean).join(" ");

  const frontWord = reversed ? voc.uebersetzung : fremdwort;

  const backWord = reversed ? fremdwort : voc.uebersetzung;

  const frontSentence = reversed ? voc.beispielsatzuebersetzung : voc.beispielsatz;

  const backSentence = reversed ? voc.beispielsatz : voc.beispielsatzuebersetzung;

  return (
    <div className="vokabel-uebung w-full max-w-xl space-y-5 p-4">
      {/* Set-Auswahl */}
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="set-groesse" className="text-sm font-semibold text-slate-700">
              Setgröße:
            </label>

            <select
              id="set-groesse"
              value={setGroesse}
              onChange={(event) => setGroesseAendern(Number(event.target.value))}
              title="Legt fest, wie viele Vokabeln ein Lernset enthält."
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
          <span className="mr-1 text-sm font-semibold text-slate-700">Set:</span>

          <button
            type="button"
            onClick={() => setAuswaehlen("alle")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              aktivesSet === "alle" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Alle
          </button>

          {Array.from({ length: anzahlSets }, (_, nummer) => nummer + 1).map((setNummer) => (
            <button
              key={setNummer}
              type="button"
              onClick={() => setAuswaehlen(setNummer)}
              className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                aktivesSet === setNummer ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {setNummer}
            </button>
          ))}
        </div>

        {/* Set-Modus */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Bildet die Sets in der ursprünglichen Reihenfolge: Set 1 enthält Vokabel 1–12, Set 2 Vokabel 13–24 etc."
            onClick={() => modusWechseln("reihenfolge")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              setModus === "reihenfolge" ? "bg-slate-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Reihenfolge
          </button>

          <button
            type="button"
            title="Mischt alle geladenen Vokabeln und verteilt sie anschließend neu auf die Sets. Jede Vokabel kommt genau einmal vor."
            onClick={() => modusWechseln("gemischt")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              setModus === "gemischt" ? "bg-slate-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            Gemischt
          </button>

          {setModus === "gemischt" && (
            <button
              type="button"
              title="Erzeugt eine neue zufällige Verteilung aller Vokabeln auf die Sets."
              onClick={setsNeuMischen}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <Shuffle className="h-4 w-4" />
              Sets neu mischen
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500">
          {aktivesSet === "alle" ? `${vocs.length} Vokabeln – alle geladenen Vokabeln` : `${karten.length} Vokabeln in Set ${aktivesSet}`}
        </div>
      </div>

      {/* Kartenstatus */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Karte {index + 1} von {karten.length}
        </span>

        <button
          type="button"
          onClick={aktuellesSetMischen}
          title="Mischt nur die Reihenfolge der Vokabeln im aktuell ausgewählten Set."
          className="font-medium text-blue-600 hover:underline"
        >
          Neu mischen
        </button>
      </div>

      {/* Lernkarte */}
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
            title={!rueckseiteSichtbar ? "Übersetzung anzeigen" : "Nächste Vokabel"}
            aria-label={!rueckseiteSichtbar ? "Übersetzung anzeigen" : "Nächste Vokabel"}
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
        <div className="mt-3 shrink-0 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
          {rueckseiteSichtbar ? (reversed ? "Fremdsprache" : "Deutsch") : reversed ? "Deutsch" : "Fremdsprache"}
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto text-center">
          <div className="flex min-h-full flex-col items-center justify-start gap-5 px-2 pb-2">
            {sentencesOnly ? (
              <div className="w-full whitespace-pre-line wrap-break-word text-2xl font-medium leading-relaxed text-slate-900 sm:text-3xl">
                {rueckseiteSichtbar ? backSentence : frontSentence}
              </div>
            ) : (
              <>
                <div className="w-full whitespace-pre-line wrap-break-word text-2xl font-bold text-slate-900">{rueckseiteSichtbar ? backWord : frontWord}</div>

                <div className="w-full whitespace-pre-line wrap-break-word text-sm leading-relaxed text-slate-600">{rueckseiteSichtbar ? backSentence : frontSentence}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
