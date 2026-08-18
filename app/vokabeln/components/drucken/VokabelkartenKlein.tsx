"use client";

import jsPDF from "jspdf";
import type { Voc } from "../../types";

type VokabelkartenKleinProps = {
  vocs: Voc[];
};

function stripHtml(value: string) {
  const element = document.createElement("div");
  element.innerHTML = value ?? "";
  return element.textContent ?? "";
}

export default function VokabelkartenKlein({ vocs }: VokabelkartenKleinProps) {
  function generatePDF() {
    if (vocs.length === 0) {
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const boxWidth = pageWidth / 3;
    const boxHeight = pageHeight / 6;

    const itemsPerPage = 18;

    function getPosition(index: number) {
      const column = index % 3;
      const row = Math.floor(index / 3);

      return {
        x: column * boxWidth,
        y: row * boxHeight,
      };
    }

    function getBackPosition(index: number) {
      const column = index % 3;
      const row = Math.floor(index / 3);

      const mirroredColumn = 2 - column;

      return {
        x: mirroredColumn * boxWidth,
        y: row * boxHeight,
      };
    }

    function drawGrid() {
      for (let index = 0; index < itemsPerPage; index++) {
        const { x, y } = getPosition(index);

        doc.rect(x, y, boxWidth, boxHeight);
      }
    }

    function drawTextFitted({
      text,
      x,
      y,
      maxWidth,
      maxHeight,
      startFontSize = 10,
      minFontSize = 7,
      lineHeightFactor = 0.45,
      fontStyle = "normal",
    }: {
      text: string;
      x: number;
      y: number;
      maxWidth: number;
      maxHeight: number;
      startFontSize?: number;
      minFontSize?: number;
      lineHeightFactor?: number;
      fontStyle?: "normal" | "bold";
    }) {
      let fontSize = startFontSize;

      doc.setFont("helvetica", fontStyle);

      while (fontSize >= minFontSize) {
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(text, maxWidth);

        const lineHeight = fontSize * lineHeightFactor;

        const textHeight = lines.length * lineHeight;

        if (textHeight <= maxHeight) {
          doc.text(lines, x, y);

          return {
            fontSize,
            height: textHeight,
            truncated: false,
          };
        }

        fontSize -= 0.5;
      }

      /*
       * Auch mit der kleinsten Schrift
       * passt der Text nicht vollständig.
       */
      doc.setFontSize(minFontSize);

      const lineHeight = minFontSize * lineHeightFactor;

      const allLines = doc.splitTextToSize(text, maxWidth);

      const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));

      const visibleLines = allLines.slice(0, maxLines);

      if (allLines.length > maxLines) {
        let lastLine = visibleLines[visibleLines.length - 1] ?? "";

        /*
         * Platz für "..." schaffen.
         */
        while (lastLine.length > 0 && doc.getTextWidth(`${lastLine}...`) > maxWidth) {
          lastLine = lastLine.slice(0, -1);
        }

        visibleLines[visibleLines.length - 1] = `${lastLine.trim()}...`;
      }

      doc.text(visibleLines, x, y);

      return {
        fontSize: minFontSize,
        height: visibleLines.length * lineHeight,
        truncated: allLines.length > maxLines,
      };
    }

    for (let startIndex = 0; startIndex < vocs.length; startIndex += itemsPerPage) {
      const pageVocs = vocs.slice(startIndex, startIndex + itemsPerPage);

      /*
       * =========================
       * VORDERSEITE
       * =========================
       */

      drawGrid();

      pageVocs.forEach((voc, index) => {
        const { x, y } = getPosition(index);

        const artikel = stripHtml(voc.artikel);

        const wort = stripHtml(voc.wort);

        const beispielsatz = stripHtml(voc.beispielsatz);

        const hauptwort = artikel ? `${artikel} ${wort}` : wort;

        /*
         * ID klein oben rechts
         */
        doc.setFont("helvetica", "normal");

        doc.setFontSize(6);

        doc.text(String(voc.id), x + boxWidth - 4, y + 5, {
          align: "right",
        });

        /*
         * Bereich für das Hauptwort
         */
        const wordY = y + 9;

        const wordMaxHeight = 10;

        const wordResult = drawTextFitted({
          text: hauptwort,
          x: x + 4,
          y: wordY,
          maxWidth: boxWidth - 8,
          maxHeight: wordMaxHeight,
          startFontSize: 10,
          minFontSize: 8,
          fontStyle: "bold",
        });

        /*
         * Beispielsatz beginnt
         * unterhalb des Hauptwortes.
         */
        if (beispielsatz) {
          const exampleY = wordY + wordResult.height + 2;

          const availableHeight = y + boxHeight - 4 - exampleY;

          if (availableHeight > 0) {
            drawTextFitted({
              text: beispielsatz,
              x: x + 4,
              y: exampleY,
              maxWidth: boxWidth - 8,
              maxHeight: availableHeight,
              startFontSize: 9,
              minFontSize: 7,
              fontStyle: "normal",
            });
          }
        }
      });

      /*
       * =========================
       * RÜCKSEITE
       * =========================
       */

      doc.addPage();
      drawGrid();

      pageVocs.forEach((voc, index) => {
        const { x, y } = getBackPosition(index);

        const uebersetzung = stripHtml(voc.uebersetzung);

        const beispielsatzuebersetzung = stripHtml(voc.beispielsatzuebersetzung);

        /*
         * ID klein oben rechts
         */
        doc.setFont("helvetica", "normal");

        doc.setFontSize(6);

        doc.text(String(voc.id), x + boxWidth - 4, y + 5, {
          align: "right",
        });

        /*
         * Übersetzung
         */
        const translationY = y + 9;

        const translationMaxHeight = 10;

        const translationResult = drawTextFitted({
          text: uebersetzung,
          x: x + 4,
          y: translationY,
          maxWidth: boxWidth - 8,
          maxHeight: translationMaxHeight,
          startFontSize: 10,
          minFontSize: 8,
          fontStyle: "bold",
        });

        /*
         * Beispielsatzübersetzung
         */
        if (beispielsatzuebersetzung) {
          const exampleTranslationY = translationY + translationResult.height + 2;

          const availableHeight = y + boxHeight - 4 - exampleTranslationY;

          if (availableHeight > 0) {
            drawTextFitted({
              text: beispielsatzuebersetzung,
              x: x + 4,
              y: exampleTranslationY,
              maxWidth: boxWidth - 8,
              maxHeight: availableHeight,
              startFontSize: 9,
              minFontSize: 7,
              fontStyle: "normal",
            });
          }
        }
      });

      /*
       * Weitere Vorderseite,
       * falls noch Vokabeln folgen.
       */
      if (startIndex + itemsPerPage < vocs.length) {
        doc.addPage();
      }
    }

    doc.save("Vokabelkarten-klein.pdf");
  }

  return (
    <button
      type="button"
      onClick={generatePDF}
      disabled={vocs.length === 0}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      Vokabelkarten klein drucken
    </button>
  );
}
