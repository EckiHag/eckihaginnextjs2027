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
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json({ error: "Keine gültige Vokabel-ID übergeben." }, { status: 400 });
    }

    await prisma.vocs.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error("Fehler beim Löschen der Vokabel:", error);

    return NextResponse.json(
      {
        error: "Die Vokabel konnte nicht gelöscht werden.",
      },
      {
        status: 500,
      },
    );
  }
}
