import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";
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
      id,
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
      datum,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Keine Vokabel-ID übergeben." }, { status: 400 });
    }

    const updatedVoc = await prisma.vocs.update({
      where: {
        id: Number(id),
      },

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

        ...(datum && {
          datum: new Date(datum),
        }),
      },
    });

    return NextResponse.json({
      voc: updatedVoc,
    });
  } catch (error) {
    console.error("Fehler beim Speichern der Vokabel:", error);

    return NextResponse.json(
      {
        error: "Die Vokabel konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      },
    );
  }
}
