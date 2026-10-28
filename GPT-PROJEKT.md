# EckiHack -- GPT-PROJEKT

Stand: 28.10.2026

## 1. Zweck dieser Datei

Diese Datei enthält den technischen Projektstand, wichtige Konventionen
und bereits gelöste typische Probleme des Projekts **EckiHack**. Sie
soll bei zukünftiger Arbeit mit GPT als dauerhafte Projektgrundlage
dienen.

Bei Änderungen am Projekt soll diese Datei aktualisiert werden, wenn
sich Architektur, Konventionen oder wichtige Arbeitsweisen ändern.

------------------------------------------------------------------------

## 2. Projektübersicht

EckiHack ist eine Next.js-Anwendung mit Schwerpunkt auf einer
Vokabelplattform.

### Technik

-   Next.js 16
-   TypeScript
-   React
-   Prisma
-   MySQL
-   NextAuth
-   Tailwind CSS 4
-   shadcn/ui
-   lucide-react Icons
-   Deployment über GitHub/Vercel vorgesehen

### Wichtige Bereiche

-   `/vokabeln`
-   `/personen`
-   `/datenbanktest`
-   `/designtestpage`

------------------------------------------------------------------------

## 3. Vokabel-Datenmodell

Wichtige Felder der Vokabeldatensätze:

-   `id`
-   `ord`
-   `art`
-   `artikel`
-   `wort`
-   `uebersetzung`
-   `beispielsatz`
-   `beispielsatzuebersetzung`
-   `sprache`
-   `book`
-   `chapter`
-   `datum`
-   `schwierigkeitsgrad`
-   `kapitel`
-   `kapiteltext`

Mehrere Textfelder können HTML enthalten. Die Ausgabe erfolgt teilweise
über `dangerouslySetInnerHTML`.

------------------------------------------------------------------------

## 4. Ansichten des Vokabelmoduls

Das Vokabelmodul besitzt insbesondere:

-   **Liste**
-   **Karten**
-   **Üben**
-   **Drucken**

Wichtige Komponenten sind unter anderem:

-   `VokabelAuswahl`
-   `VokabelListe.tsx`
-   `VokabelKarten.tsx`
-   `VokabelUeben.tsx`
-   `VokabelEditor`

------------------------------------------------------------------------

## 5. Arbeitsweise bei Änderungen mit GPT

Bei zukünftigen Codeänderungen gelten folgende Regeln:

1.  Änderungen möglichst **schrittweise** durchführen.
2.  Genau angeben, **welcher vorhandene Codeblock ersetzt** werden soll.
3.  Bestehende Funktionen nicht unnötig umbauen.
4.  Erst das aktuelle Problem lösen und danach weitere Verbesserungen
    vornehmen.
5.  Responsive Darstellung immer für **Desktop, Tablet und Smartphone**
    berücksichtigen.
6.  Vorhandene Projektkonventionen bevorzugen, statt neue parallele
    Lösungen einzuführen.
7.  Bei Tailwind-Warnungen bzw. kanonischen Klassenvorschlägen die vom
    aktuellen Tooling bevorzugte Schreibweise verwenden.

------------------------------------------------------------------------

## 6. Tailwind-CSS-Konventionen

Das Projekt verwendet Tailwind CSS 4.

### Kanonische Größenangaben

Wenn Tailwind bzw. das Tooling eine kanonische numerische Utility
empfiehlt, soll diese bevorzugt werden.

Beispiel für 650 px:

Nicht bevorzugt:

`max-w-[650px]`

Bevorzugt:

`max-w-162.5`

Hintergrund:

`162.5 × 4px = 650px`

Für die Vokabelliste daher beispielsweise:

`className="ml-auto w-full max-w-162.5 overflow-hidden rounded-xl border border-border bg-card"`

------------------------------------------------------------------------

## 7. Globale Gestaltung

Die globale CSS-Datei ist:

`app/globals.css`

Sie enthält:

-   Tailwind-Import
-   `tw-animate-css`
-   `shadcn/tailwind.css`
-   helles und dunkles Farbschema
-   CSS-Variablen für Farben
-   globale Basiseinstellungen
-   spezielle responsive Regeln

Vorhandene Farbvariablen sollen bevorzugt verwendet werden, zum
Beispiel:

-   `--background`
-   `--foreground`
-   `--card`
-   `--card-foreground`
-   `--border`
-   `--muted`
-   `--muted-foreground`
-   `--primary`
-   `--secondary`

Keine unnötigen fest codierten Farben verwenden, wenn bereits eine
passende Projektvariable existiert.

------------------------------------------------------------------------

## 8. HTML aus Datenbankfeldern

HTML wird teilweise direkt aus Vokabel-Datensätzen ausgegeben,
beispielsweise mit:

`dangerouslySetInnerHTML`

CSS-Klassen innerhalb dieser gespeicherten HTML-Inhalte können auf
Regeln in `app/globals.css` zugreifen.

Der Datensatz selbst benötigt keinen eigenen `<link>` auf eine
CSS-Datei.

### Responsive Datenkarten

Breite HTML-Tabellen sollen bei geeigneten Inhalten durch responsive
Karten ersetzt werden.

Verwendete Klassen:

-   `.dataCards`
-   `.dataCard`

Strukturbeispiel:

``` html
<div class="dataCards">
  <div class="dataCard">
    <h2>SB41</h2>
    <dl>
      <dt>Innen</dt>
      <dd>30mm</dd>
      <dt>Durchmesser</dt>
      <dd>250mm</dd>
    </dl>
  </div>
</div>
```

Auf größeren Bildschirmen können zwei Karten nebeneinander stehen; auf
schmalen Bildschirmen eine Karte pro Zeile.

### Lange Links

Für Links aus Datenbank-HTML wird die Klasse `.liAnker` verwendet.

Sie soll lange Inhalte umbrechen können:

``` css
.liAnker {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}
```

------------------------------------------------------------------------

## 9. Vokabelliste

### Grundlayout

Die gesamte Vokabelliste soll:

-   auf allen Bildschirmgrößen rechts ausgerichtet sein,
-   auf kleinen Bildschirmen die verfügbare Breite verwenden,
-   auf großen Bildschirmen ungefähr 650 px breit bleiben.

Der äußere Listencontainer verwendet daher:

`ml-auto w-full max-w-162.5`

Beispiel:

``` tsx
<div className="ml-auto w-full max-w-162.5 overflow-hidden rounded-xl border border-border bg-card">
```

### Listenzeile

In einer Listenzeile soll gelten:

-   **Wort links**
-   **Bedienbuttons rechts**
-   Wort darf umbrechen
-   Buttons behalten ihre Breite

Wichtige Flex-Regeln:

-   Wortbereich: `min-w-0 flex-1`
-   Buttonbereich: `shrink-0`

### Buttons

Vorgesehen sind Funktionen für:

-   Beispielsatz
-   Übersetzung des Wortes
-   Übersetzung des Beispielsatzes
-   Bearbeiten
-   Löschen

Die Inhalte von Beispielsatz und Übersetzung werden über
Popover/Tooltip-artige Elemente angezeigt.

------------------------------------------------------------------------

## 10. Vokabelkarten

Bei der Kartenansicht war ein wichtiges responsives Problem, dass Titel
und Buttons bei mittleren Breiten in derselben Zeile zu wenig Platz
hatten.

### Regel

Nicht bereits ab `sm` Titel und Buttons nebeneinander zwingen.

Für den Kopfbereich wurde als geeigneter Ansatz festgelegt:

-   bis unter `lg`: Titel und Buttons untereinander
-   ab `lg`: Titel rechts und Buttons links in einer gemeinsamen Zeile

Beispiel:

`flex min-w-0 max-w-full flex-col gap-3 lg:flex-row-reverse lg:items-start lg:gap-4`

Wichtig:

Tailwind-Breakpoints beziehen sich standardmäßig auf die
**Viewport-Breite**, nicht auf die tatsächliche Breite eines inneren
Containers.

------------------------------------------------------------------------

## 11. Drehen / Sprachrichtung

Es gibt einen globalen Zustand:

``` tsx
const [reversed, setReversed] = useState(false);
```

Dieser steuert Fremdsprache → Deutsch bzw. Deutsch → Fremdsprache.

`reversed` wird an Liste, Karten und Übungsmodus weitergegeben.

------------------------------------------------------------------------

## 12. Suche: Gruppe / Wortsuche

Ein gemeinsames Eingabefeld unterstützt verschiedene Sucharten:

-   zweistellige Zahl wie `01` → Kapitelgruppe
-   einzelner Buchstabe wie `A` → Wörter mit diesem Anfangsbuchstaben
-   drei oder mehr Zeichen → Wortsuche als Teilstring

API-Aktionen umfassen unter anderem:

-   `chapterGroup`
-   `letterGroup`
-   `wordSearch`

Für `wordSearch` sind mindestens drei Zeichen erforderlich.

------------------------------------------------------------------------

## 13. Übungsmodus

Der Übungsmodus arbeitet mit Lernsets.

### Funktionen

-   Setgröße konfigurierbar
-   Sets: `Alle`, `1`, `2`, ...
-   Modi:
    -   `Reihenfolge`
    -   `Gemischt`
-   `Sets neu mischen` verteilt alle geladenen Vokabeln neu auf Sets
-   `Neu mischen` mischt nur das aktuell ausgewählte Set

### Setgrößen

Vorgesehene Größen:

-   6
-   8
-   10
-   12
-   15
-   20

Standard:

`12`

### Navigation

Die Navigation ist endlos/zyklisch:

-   nach der letzten Karte folgt wieder die erste
-   von der ersten Karte rückwärts gelangt man zur letzten

Es gibt keinen separaten Bildschirm „Durchgang geschafft".

### React-State

Eine frühere Lösung mit synchronen `setState`-Aufrufen in `useEffect`
führte zu einer Warnung.

Stattdessen wird `VokabelUeben` bei geänderten Vokabeln über einen `key`
neu gemountet.

------------------------------------------------------------------------

## 14. Wörterbuch-Links

In der Kartenansicht existieren bzw. existierten Links zu:

-   dict.cc
-   LEO
-   PONS
-   Google Übersetzer

PONS wird für spanisch-deutsche Wörter beispielsweise über eine URL mit
dem kodierten Vokabelwort aufgerufen.

------------------------------------------------------------------------

## 15. Kapitel-Sortierung

Kapitel sollen nach `chapter` sortiert werden.

Bei Problemen mit Prisma `distinct` soll nicht blind auf `kapitel`
sortiert werden.

Robuste Möglichkeiten:

-   nur `chapter` selektieren und sortieren
-   bei Bedarf Datensätze anschließend per `Map` deduplizieren
-   alternativ `groupBy` verwenden

------------------------------------------------------------------------

## 16. Drucken

Es gibt PDF-Ausgaben für Vokabelkarten:

-   Vokabelkarten Groß
-   Vokabelkarten Klein

A4-Layout unter anderem 2 × 4 Karten.

Die Druckbuttons sollen in der Auswahlansicht rechts stehen, während
Such-/Auswahlfelder links bleiben.

------------------------------------------------------------------------

## 17. Bereits bekannte Fehlerquellen

### Zu breite Flex-Zeilen

Bei Text neben festen Buttons immer prüfen:

-   `min-w-0` am flexiblen Textcontainer
-   `flex-1` am Textcontainer
-   `shrink-0` am Buttoncontainer
-   geeignete Breakpoints

### Zu frühe Breakpoints

`sm` beginnt bereits bei 640 px. Eine Seite kann durch Sidebar oder
andere Bereiche deutlich weniger nutzbare Breite besitzen.

Deshalb bei komplexen Kopfzeilen gegebenenfalls erst ab `lg` auf ein
horizontales Layout wechseln.

### Lange HTML-Inhalte

Für lange Links oder untrennbare Inhalte:

-   `overflow-wrap: anywhere`
-   gegebenenfalls `word-break: break-word`
-   `white-space: normal`

### Breite Tabellen

Auf Mobile nach Möglichkeit nicht sieben Spalten in einer klassischen
Tabelle darstellen.

Stattdessen responsive Karten/Definitionslisten verwenden.

------------------------------------------------------------------------

## 18. Pflege dieser Datei

Diese Datei aktualisieren, wenn:

-   neue zentrale Komponenten hinzukommen,
-   Datenmodell oder API-Struktur geändert werden,
-   eine neue verbindliche Tailwind-/UI-Konvention entsteht,
-   ein wiederkehrender Fehler dauerhaft gelöst wurde,
-   sich Deployment oder Projektarchitektur ändern.

Einzelne kleine Änderungen gehören dagegen primär in `CHANGELOG.md`.
