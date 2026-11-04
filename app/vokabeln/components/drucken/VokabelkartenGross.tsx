"use client";

import jsPDF from "jspdf";
import type { Voc } from "../../types";

type VokabelkartenGrossProps = {
  vocs: Voc[];
};

function stripHtml(value: string) {
  const element = document.createElement("div");
  element.innerHTML = value ?? "";
  return element.textContent ?? "";
}

export default function VokabelkartenGross({ vocs }: VokabelkartenGrossProps) {
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

    const boxWidth = pageWidth / 2;
    const boxHeight = pageHeight / 4;

    const itemsPerPage = 8;

    // function getPosition(index: number) {
    //   const column = index % 2;
    //   const row = Math.floor(index / 2);

    //   return {
    //     x: column * boxWidth,
    //     y: row * boxHeight,
    //   };
    // }

    function getBackPosition(index: number) {
      const column = index % 2;
      const row = Math.floor(index / 2);

      const mirroredColumn = column === 0 ? 1 : 0;

      return {
        x: mirroredColumn * boxWidth,
        y: row * boxHeight,
      };
    }

    for (let startIndex = 0; startIndex < vocs.length; startIndex += itemsPerPage) {
      const pageVocs = vocs.slice(startIndex, startIndex + itemsPerPage);

      /*
       * VORDERSEITEN
       */
      pageVocs.forEach((voc, index) => {
        const x = (index % 2) * boxWidth;
        const y = Math.floor(index / 2) * boxHeight;

        drawGrid();

        const artikel = stripHtml(voc.artikel);
        const wort = stripHtml(voc.wort);
        const frase = stripHtml(voc.frase);
        const beispielsatz = stripHtml(voc.beispielsatz);

        const hauptwort = artikel ? `${artikel} ${wort}` : wort;

        // ID klein oben rechts
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);

        doc.text(String(voc.id), x + boxWidth - 5, y + 6, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const zeilenAufKarteVorne = 12;
        const wordLines = doc.splitTextToSize(hauptwort, boxWidth - 10).slice(0, zeilenAufKarteVorne);

        doc.text(wordLines, x + 5, y + 16);

        const wordHeight = wordLines.length * 5;
        let textY = y + 18 + wordHeight;
        const maxY = y + boxHeight - 5;

        if (frase && textY < maxY) {
          doc.setFontSize(10);

          const phraseLines = doc.splitTextToSize(frase, boxWidth - 10).slice(0, Math.max(0, Math.floor((maxY - textY) / 5)));

          if (phraseLines.length > 0) {
            doc.text(phraseLines, x + 5, textY);
            textY += phraseLines.length * 5 + 2;
          }
        }

        if (beispielsatz && textY < maxY) {
          doc.setFontSize(10);

          const exampleLines = doc.splitTextToSize(beispielsatz, boxWidth - 10).slice(0, Math.max(0, Math.floor((maxY - textY) / 5)));

          if (exampleLines.length > 0) {
            doc.text(exampleLines, x + 5, textY);
          }
        }
      });

      function drawGrid() {
        // for (let index = 0; index < 8; index++) {
        //   const { x, y } = getPosition(index);
        //   doc.rect(x, y, boxWidth, boxHeight);
        // }
      }

      /*
       * RÜCKSEITE
       */
      doc.addPage();
      drawGrid();
      pageVocs.forEach((voc, index) => {
        /*
         * Jede Karte wird horizontal gespiegelt.
         *
         * Vorderseite links  -> Rückseite rechts
         * Vorderseite rechts -> Rückseite links
         */
        const { x, y } = getBackPosition(index);

        drawGrid();

        const uebersetzung = stripHtml(voc.uebersetzung);

        const fraseuebersetzung = stripHtml(voc.fraseuebersetzung);

        const beispielsatzuebersetzung = stripHtml(voc.beispielsatzuebersetzung);

        // ID klein oben rechts
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);

        doc.text(String(voc.id), x + boxWidth - 5, y + 6, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        const zeilenAufKarteHinten = 12;
        const translationLines = doc.splitTextToSize(uebersetzung, boxWidth - 10).slice(0, zeilenAufKarteHinten);

        doc.text(translationLines, x + 5, y + 16);

        const translationHeight = translationLines.length * 5;
        let textY = y + 18 + translationHeight;
        const maxY = y + boxHeight - 5;

        if (fraseuebersetzung && textY < maxY) {
          doc.setFontSize(10);

          const phraseLines = doc.splitTextToSize(fraseuebersetzung, boxWidth - 10).slice(0, Math.max(0, Math.floor((maxY - textY) / 5)));

          if (phraseLines.length > 0) {
            doc.text(phraseLines, x + 5, textY);
            textY += phraseLines.length * 5 + 2;
          }
        }

        if (beispielsatzuebersetzung && textY < maxY) {
          doc.setFontSize(10);

          const exampleLines = doc.splitTextToSize(beispielsatzuebersetzung, boxWidth - 10).slice(0, Math.max(0, Math.floor((maxY - textY) / 5)));

          if (exampleLines.length > 0) {
            doc.text(exampleLines, x + 5, textY);
          }
        }
      });

      /*
       * Neue Vorderseite,
       * sofern weitere Vokabeln folgen.
       */
      if (startIndex + itemsPerPage < vocs.length) {
        doc.addPage();
        drawGrid();
      }
    }

    doc.save("Vokabelkarten-gross.pdf");
  }

  return (
    <button
      type="button"
      onClick={generatePDF}
      disabled={vocs.length === 0}
      className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      VKgroß
    </button>
  );
}
