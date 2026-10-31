import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/client";
import { isBackendLanguage } from "@/lib/backend-access";

export const runtime = "nodejs";

const CSV_COLUMNS = ["sprache", "book", "chapter", "wort", "uebersetzung", "beispielsatz", "beispielsatzuebersetzung", "frase", "fraseuebersetzung"] as const;

type CsvColumn = (typeof CSV_COLUMNS)[number];
type CsvRow = Record<CsvColumn, string>;

const MAX_FILE_SIZE = 1024 * 1024;
const MAX_ROWS = 1000;

class ImportError extends Error {}

export async function POST(request: Request) {
  try {
    // 1. Anmeldung prüfen.
    const session = await auth();
    const userId = Number(session?.user?.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Bitte melde dich an." }, { status: 401 });
    }

    // Aktuelle Berechtigung direkt aus der Datenbank lesen.
    const user = await prisma.userEckiHack.findUnique({
      where: { id: userId },
      select: {
        active: true,
        role: true,
        username: true,
      },
    });

    const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

    if (!user || !user.active || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: "Du hast keine Berechtigung zum Importieren." }, { status: 403 });
    }

    // 2. Hochgeladene Datei lesen.
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      throw new ImportError("Die Datei konnte nicht empfangen werden.");
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ImportError("Bitte wähle eine CSV-Datei aus.");
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new ImportError("Es sind nur CSV-Dateien erlaubt.");
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      throw new ImportError("Die Datei muss Inhalt haben und darf höchstens 1 MB groß sein.");
    }

    let csvText: string;

    try {
      csvText = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
    } catch {
      throw new ImportError("Bitte speichere die CSV-Datei als UTF-8.");
    }

    // 3. CSV lesen. Das Muster verwendet Kommas als Trennzeichen.
    let rows: CsvRow[];

    try {
      rows = parse(csvText, {
        bom: true,
        delimiter: ",",
        skip_empty_lines: true,
        trim: true,
        max_record_size: MAX_FILE_SIZE,

        columns: (headers: string[]) => {
          const normalized = headers.map((header) => header.trim());

          const valid = normalized.length === CSV_COLUMNS.length && new Set(normalized).size === CSV_COLUMNS.length && CSV_COLUMNS.every((column) => normalized.includes(column));

          if (!valid) {
            throw new ImportError(`Die CSV muss genau diese Spalten enthalten: ${CSV_COLUMNS.join(", ")}`);
          }

          return normalized;
        },
      }) as CsvRow[];
    } catch (error) {
      if (error instanceof ImportError) {
        throw error;
      }

      throw new ImportError("Die CSV ist ungültig. Prüfe Kommas, Anführungszeichen und die Anzahl der Spalten.");
    }

    if (rows.length === 0 || rows.length > MAX_ROWS) {
      throw new ImportError(`Die CSV muss zwischen 1 und ${MAX_ROWS} Datensätze enthalten.`);
    }

    // 4. Alle Datensätze prüfen, bevor etwas gespeichert wird.
    const lengthLimits = {
      sprache: 20,
      book: 99,
      chapter: 99,
      wort: 255,
    } as const;

    const requiredColumns = ["sprache", "book", "chapter", "wort"] as const;

    for (const [index, row] of rows.entries()) {
      const recordNumber = index + 1;

      for (const column of requiredColumns) {
        row[column] = row[column].trim();

        if (!row[column]) {
          throw new ImportError(`Datensatz ${recordNumber}: „${column}“ darf nicht leer sein.`);
        }

        if ([...row[column]].length > lengthLimits[column]) {
          throw new ImportError(`Datensatz ${recordNumber}: „${column}“ darf höchstens ${lengthLimits[column]} Zeichen enthalten.`);
        }
      }

      for (const column of CSV_COLUMNS) {
        if (Buffer.byteLength(row[column], "utf8") > 65535) {
          throw new ImportError(`Datensatz ${recordNumber}: Der Inhalt von „${column}“ ist zu lang.`);
        }
      }

      if (user.role !== UserRole.ADMIN && isBackendLanguage(row.sprache)) {
        return NextResponse.json(
          {
            error: `Datensatz ${recordNumber}: Dieser Bereich ist nur für Administratoren zugänglich.`,
          },
          { status: 403 },
        );
      }
    }

    // 5. Neue Vokabeln gemeinsam speichern.
    const data = rows.map((row) => ({
      ...row,

      // Weitere Pflichtfelder aus deinem Prisma-Modell:
      eigenerKommentar: "",
      sentences: "",

      // Herkunft und Erstellungsdatum:
      usernameVocs: user.username,
      datum: new Date(),
    }));

    const result = await prisma.$transaction(async (tx) => {
      return tx.vocs.createMany({ data });
    });

    return NextResponse.json({
      count: result.count,
      message: `${result.count} Datensätze wurden importiert.`,
    });
  } catch (error) {
    if (error instanceof ImportError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Fehler beim CSV-Import:", error);

    return NextResponse.json({ error: "Der Import konnte nicht abgeschlossen werden." }, { status: 500 });
  }
}
