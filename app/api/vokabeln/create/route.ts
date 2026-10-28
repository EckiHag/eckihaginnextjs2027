import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";
import { isBackendLanguage } from "@/lib/backend-access";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Dein Konto ist noch nicht freigeschaltet." }, { status: 403 });
    }
    const body = await request.json();

    const {
      ord,
      art,
      artikel,
      wort,
      uebersetzung,
      beispielsatz,
      beispielsatzuebersetzung,
      eigenerKommentar,
      sprache,
      book,
      chapter,
      schwierigkeitsgrad,
      kapitel,
      kapiteltext,
      sentences,
      frase,
      fraseuebersetzung,
      datum,
    } = body;
    if (session.user.role !== "ADMIN" && isBackendLanguage(sprache)) {
      return NextResponse.json({ error: "Dieser Bereich ist nur für Administratoren zugänglich." }, { status: 403 });
    }
    const newVoc = await prisma.vocs.create({
      data: {
        ord: Number(ord ?? 0),

        art: art ?? "",
        artikel: artikel ?? "",
        wort: wort ?? "",

        uebersetzung: uebersetzung ?? "",
        beispielsatz: beispielsatz ?? "",
        beispielsatzuebersetzung: beispielsatzuebersetzung ?? "",
        eigenerKommentar: eigenerKommentar ?? "",

        sprache: sprache ?? "",
        book: book ?? "",
        chapter: chapter ?? "",

        schwierigkeitsgrad: Number(schwierigkeitsgrad ?? 0),
        kapitel: Number(kapitel ?? 0),
        kapiteltext: kapiteltext ?? "",

        sentences: sentences ?? "",
        frase: frase ?? "",
        fraseuebersetzung: fraseuebersetzung ?? "",

        ...(datum && {
          datum: new Date(datum),
        }),
      },
    });

    return NextResponse.json({
      voc: newVoc,
    });
  } catch (error) {
    console.error("Fehler beim Anlegen der Vokabel:", error);

    return NextResponse.json(
      {
        error: "Die Vokabel konnte nicht angelegt werden.",
      },
      {
        status: 500,
      },
    );
  }
}
