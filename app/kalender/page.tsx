import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { addMonths, format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import ScrollToDate from "./ScrollToDate";
import ScrollToTodayButton from "./ScrollToTodayButton";

export const dynamic = "force-dynamic";

function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBackgroundColor(ferien: string, wochentag: string, datum: Date, today: Date) {
  // Normaler Tag
  let backgroundColor = "#4CAF50";

  // Ferien
  if (ferien.length > 0) {
    backgroundColor = "#CDDC39";

    if (ferien === "Ka") {
      backgroundColor = "#F2AB39";
    }

    if (ferien === "Chi") {
      backgroundColor = "#85B8CB";
    }

    if (ferien === "Us") {
      backgroundColor = "#E4B660";
    }
  }

  // Wochenende
  if (wochentag === "Sa.") {
    backgroundColor = "#3CC0FB";
  } else if (wochentag === "So.") {
    backgroundColor = "#6BD1FF";
  }

  // Heute hat höchste Priorität
  if (datum.toLocaleDateString("de-DE") === today.toLocaleDateString("de-DE")) {
    backgroundColor = "#009688";
  }

  return backgroundColor;
}

type KalenderPageProps = {
  searchParams: Promise<{
    start?: string;
    scrollTo?: string;
  }>;
};
export default async function KalenderPage({ searchParams }: KalenderPageProps) {
  const params = await searchParams;

  const today = new Date();

  const todayId = `date-${format(today, "yyyy-MM-dd")}`;

  const scrollToDate = params.scrollTo ?? format(today, "yyyy-MM-dd");

  const scrollToId = `date-${scrollToDate}`;

  let startDate = today;

  if (params.start) {
    const parsedDate = new Date(`${params.start}T12:00:00`);

    if (!Number.isNaN(parsedDate.getTime())) {
      startDate = parsedDate;
    }
  }

  const from = addMonths(startDate, -1);
  const to = addMonths(startDate, 6);

  const previousStart = addMonths(startDate, -6);
  const nextStart = addMonths(startDate, 6);

  const dates = await prisma.dates.findMany({
    where: {
      Datum: {
        gte: new Date(getDateString(from)),
        lte: new Date(getDateString(to)),
      },
    },
    orderBy: {
      Datum: "asc",
    },
  });

  return (
    <section className="mx-auto max-w-3xl p-4 sm:p-6">
      <ScrollToDate dateId={scrollToId} />
      <h1 className="mb-4 text-2xl font-bold">Kalender</h1>

      {/* Navigation */}
      <div className="mb-4 rounded-lg border border-border bg-sky-100 p-3">
        <div className="flex items-center justify-between gap-2">
          {/* vorheriger Zeitraum */}
          <Link
            href={`/kalender?start=${format(previousStart, "yyyy-MM-dd")}`}
            className="flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
            title="Vorheriger Zeitraum"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          {/* Heute */}
          <Link href="/kalender" className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted">
            <CalendarDays className="h-4 w-4" />
            Heute
          </Link>

          {/* nächster Zeitraum */}
          <Link
            href={`/kalender?start=${format(nextStart, "yyyy-MM-dd")}`}
            className="flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-muted"
            title="Nächster Zeitraum"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          {from.toLocaleDateString("de-DE")} bis {to.toLocaleDateString("de-DE")}
        </div>
      </div>

      <div className="space-y-2">
        {dates.map((date) => {
          const backgroundColor = getBackgroundColor(date.Ferien, date.Wochentag, date.Datum, today);

          return (
            <div
              key={date.OID}
              id={`date-${format(date.Datum, "yyyy-MM-dd")}`}
              className="scroll-mt-24 rounded-lg border border-border p-4 shadow-sm"
              style={{
                backgroundColor,
              }}
            >
              {/* Obere Zeile: Datum, Wochentag, Feiertag, Kalenderwoche */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-xl font-semibold">{date.Datum.toLocaleDateString("de-DE")}</span>

                  <span className="font-medium">{date.Wochentag}</span>

                  {date.Feiertag && <span className="text-sm">{date.Feiertag}</span>}
                </div>

                <span className="shrink-0 text-xl font-semibold">{date.Kalenderwoche.replace("KW ", "")}</span>
              </div>

              {/* Termin */}
              {date.Termin && <div className="mt-3 text-sm">{date.Termin}</div>}

              {/* Ferien */}
              {date.Ferien && <div className="mt-2 text-xs font-medium">Ferien: {date.Ferien}</div>}

              {/* Aktionen */}
              <div className="mt-3 flex items-center justify-end gap-1">
                <ScrollToTodayButton todayId={todayId} />

                <Link
                  href={`/kalender/bearbeiten/${date.OID}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/10"
                  title="Kalendertag bearbeiten"
                >
                  <Pencil className="h-5 w-5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
