import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
    }

    const body = await request.json();

    const { id, artikel, wort, uebersetzung, beispielsatz, beispielsatzuebersetzung, eigenerKommentar } = body;

    if (!id) {
      return NextResponse.json({ error: "Keine Vokabel-ID übergeben." }, { status: 400 });
    }

    const updatedVoc = await prisma.vocs.update({
      where: {
        id: Number(id),
      },
      data: {
        artikel,
        wort,
        uebersetzung,
        beispielsatz,
        beispielsatzuebersetzung,
        eigenerKommentar,
      },
    });

    return NextResponse.json({
      voc: updatedVoc,
    });
  } catch (error) {
    console.error("Fehler beim Speichern der Vokabel:", error);

    return NextResponse.json({ error: "Die Vokabel konnte nicht gespeichert werden." }, { status: 500 });
  }
}
