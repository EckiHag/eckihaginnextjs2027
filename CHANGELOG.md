# EckiHack -- CHANGELOG

Wichtige Änderungen und Entscheidungen am Projekt.

------------------------------------------------------------------------

## 28.10.2026

### Vokabelliste -- Breite und Ausrichtung

-   Gesamte Vokabelliste auf großen Bildschirmen begrenzt.
-   Liste bleibt auf allen Bildschirmen rechts ausgerichtet.
-   Mobile verwendet weiterhin die verfügbare Breite.
-   Maximale Zielbreite: 650 px.
-   Tailwind-4-Schreibweise angepasst:
    -   nicht bevorzugt: `max-w-[650px]`
    -   bevorzugt: `max-w-162.5`
-   Äußerer Listencontainer: `ml-auto w-full max-w-162.5`

### Vokabelliste -- Wort und Buttons

-   Wort in der Listenzeile nach links gesetzt.
-   Bedienbuttons innerhalb der begrenzten Liste rechts ausgerichtet.
-   Wortbereich verwendet `min-w-0 flex-1`.
-   Buttonbereich verwendet `shrink-0`.
-   Übersetzung erhält einen eigenen Popover-/Tooltip-Button.
-   Beispielsatz, Satzübersetzung, Bearbeiten und Löschen bleiben als
    separate Aktionen verfügbar.

### Responsive HTML-Daten

-   Breite Tabellen für „Sägekisten" und „Sägeblätter" konzeptionell
    durch Karten ersetzt.
-   Neue HTML-Struktur mit `.dataCards`, `.dataCard`, `<dl>`, `<dt>` und
    `<dd>`.
-   CSS wird zentral über `app/globals.css` bereitgestellt.
-   Datenbankdatensätze müssen keine eigene CSS-Datei verlinken.
-   Darstellung soll auf Desktop mehrspaltig und auf Mobile einspaltig
    funktionieren.
-   Bestehende Farbvariablen aus `globals.css` sollen für
    Hell-/Dunkelmodus verwendet werden.

### Lange Links

-   Für `.liAnker` responsive Umbruchregeln vorgesehen:
    -   `white-space: normal`
    -   `overflow-wrap: anywhere`
    -   `word-break: break-word`

------------------------------------------------------------------------

## 27.10.2026 und vorher -- zusammengefasster Projektstand

### Vokabelkarten -- responsiver Kopf

-   Problem: Bei mittleren Bildschirmbreiten wurden Titel durch Buttons
    extrem schmal und teilweise buchstabenweise umgebrochen.
-   Ursache: `sm:flex-row-reverse` griff bereits ab 640 px.
-   Lösungskonzept: horizontales Kopf-Layout erst ab `lg`.
-   Bis unter `lg` bleiben Titel und Buttons in getrennten Zeilen.

### Ansichtsbuttons

-   Ansichtsbuttons `Liste`, `Karten`, `Üben`, `Drehen` und
    `Neuer Datensatz` für schmale Bildschirme umbrechbar gemacht.
-   `flex-wrap` statt starrer einzeiliger Anordnung.
-   `Neuer Datensatz` auf größeren Bildschirmen mit `sm:ml-auto`.
-   Darstellung von „Neuer Datensatz" an den dezenten Textbutton „Neu
    mischen" angeglichen.

### Sprachrichtung

-   Globalen Zustand `reversed` eingeführt.
-   Umschalten Fremdsprache ↔ Deutsch über „Drehen".
-   Zustand wird an Listen-, Karten- und Übungsansicht weitergegeben.

### Gruppe / Wortsuche

-   Gemeinsames Eingabefeld für:
    -   Kapitelgruppen
    -   Anfangsbuchstaben
    -   Wortteil-Suche
-   Zweistellige Eingabe → `chapterGroup`.
-   Ein Buchstabe → `letterGroup`.
-   Drei oder mehr Zeichen → `wordSearch`.
-   Wortsuche verwendet `contains`.

### Übungsmodus -- Sets

-   Lernsets eingeführt.
-   Standard-Setgröße zunächst 12.
-   Setgröße anschließend konfigurierbar gemacht.
-   Verfügbare Größen: 6, 8, 10, 12, 15, 20.
-   Modi `Reihenfolge` und `Gemischt`.
-   `Sets neu mischen` erzeugt eine neue Gesamtverteilung.
-   `Neu mischen` verändert nur die Reihenfolge des aktuellen Sets.

### Übungsmodus -- Navigation

-   Vorwärtsnavigation zyklisch gestaltet.
-   Nach letzter Karte folgt wieder die erste.
-   Rückwärtsnavigation ebenfalls zyklisch.
-   Kein separater Abschlussbildschirm nach einem Durchgang.

### Übungsmodus -- React-Warnung

-   Synchrones `setState` in `useEffect` vermieden.
-   Übungskomponente wird bei veränderten Vokabeln über einen `key` neu
    gemountet.
-   Anfangszustände werden über Funktionsinitialisierer von `useState`
    erzeugt.

### Wörterbuch-Verknüpfungen

-   Wörterbuch-/Übersetzungslinks in der Kartenansicht verwendet:
    -   dict.cc
    -   LEO
    -   PONS
    -   Google Übersetzer
-   PONS-Link für spanisch-deutsche Suche ergänzt/angepasst.

### Kapitel-Sortierung

-   Sortierung der Kapitel überprüft.
-   `chapter` soll maßgeblich für die Reihenfolge sein.
-   Als robuste Alternativen zu problematischem Prisma-`distinct` wurden
    Deduplizierung per `Map` bzw. `groupBy` festgehalten.

### Druckfunktionen

-   Druckfunktionen „Vokabelkarten Groß" und „Vokabelkarten Klein"
    vorhanden.
-   Druckbuttons rechts von den Such-/Auswahlfunktionen angeordnet.
-   PDF-Ausgabe umfasst unter anderem ein A4-Layout mit 2 × 4 Karten.

------------------------------------------------------------------------

## Pflege

Neue Einträge möglichst mit Datum ergänzen.

In dieses Changelog gehören insbesondere:

-   sichtbare Funktionsänderungen,
-   wichtige Bugfixes,
-   neue UI-Konventionen,
-   Änderungen an Datenbank/API,
-   neue Komponenten oder Modi,
-   relevante technische Entscheidungen.

Dauerhafte Projektregeln zusätzlich in `GPT-PROJEKT.md` übernehmen.
