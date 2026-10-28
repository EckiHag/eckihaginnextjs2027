import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";

async function checkAccess() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Bitte melde dich an." }, { status: 401 });
  }

  const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

  if (!allowedRoles.includes(session.user.role)) {
    return Response.json({ error: "Dein Konto ist noch nicht freigeschaltet." }, { status: 403 });
  }

  return null;
}

export async function GET() {
  const denied = await checkAccess();
  if (denied) return denied;

  // Hier folgt deine vorhandene Shortcut-Abfrage.

  const shortcuts = await prisma.shortcut.findMany({
    where: {
      aktiv: true,
    },
    orderBy: {
      sort: "asc",
    },
  });

  return Response.json(shortcuts);
}

export async function PUT(request: Request) {
  try {
    const denied = await checkAccess();
    if (denied) return denied;

    // Hier folgt dein vorhandenes:
    // const body = await request.json();
    const body = await request.json();

    const id = Number(body.id);
    const sprache = body.sprache ?? "";
    const book = body.book ?? "";
    const chapter = body.chapter ?? "";

    if (!id || !sprache || !book || !chapter) {
      return Response.json(
        {
          error: "ID, Sprache, Buch oder Kapitel fehlt.",
        },
        {
          status: 400,
        },
      );
    }

    const shortcut = await prisma.shortcut.update({
      where: {
        id,
      },
      data: {
        sprache,
        book,
        chapter,
      },
    });

    return Response.json({
      shortcut,
    });
  } catch (error) {
    console.error("Fehler beim Speichern des Shortcuts:", error);

    return Response.json(
      {
        error: "Shortcut konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      },
    );
  }
}
