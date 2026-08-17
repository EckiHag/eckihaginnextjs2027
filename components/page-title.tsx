"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Startseite",
  "/vokabeln": "Vokabeln anzeigen",
  "/vokabeln/suchen": "Vokabeln suchen",
  "/vokabeln/drucken": "Vokabeln drucken",
  "/daten": "Daten",
  "/datenbanktest": "Datenbanktest",
  "/designtestpage": "DesignTestPage",
};

export function PageTitle() {
  const pathname = usePathname();

  const title = pageTitles[pathname] ?? "EckiHack";

  return <h1 className="text-base font-semibold">{title}</h1>;
}
