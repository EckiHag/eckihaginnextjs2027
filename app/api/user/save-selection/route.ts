import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/client";
import { isBackendLanguage } from "@/lib/backend-access";

export async function POST(request: Request) {
  try {
    /*
     * 1. Angemeldeten Benutzer ermitteln
     */
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Nicht angemeldet.",
        },
        {
          status: 401,
        },
      );
    }

    const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Dein Konto ist noch nicht freigeschaltet." }, { status: 403 });
    }

    const userId = Number(session.user.id);

    /*
     * 2. Auswahl aus dem Request lesen
     */
    const body = await request.json();

    const language = String(body.language ?? "");
    const book = String(body.book ?? "");
    const chapter = String(body.chapter ?? "");
    if (session.user.role !== "ADMIN" && isBackendLanguage(language)) {
      return NextResponse.json({ error: "Dieser Bereich ist nur für Administratoren zugänglich." }, { status: 403 });
    }
    /*
     * 3. Auswahl beim Benutzer speichern
     */
    await prisma.userEckiHack.update({
      where: {
        id: userId,
      },
      data: {
        sprache_save: language,
        book_save: book,
        chapter_save: chapter,
      },
    });

    /*
     * 4. Erfolg zurückgeben
     */
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Fehler beim Speichern der Vokabelauswahl:", error);

    return NextResponse.json(
      {
        error: "Die Auswahl konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      },
    );
  }
}
