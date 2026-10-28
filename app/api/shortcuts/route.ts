import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";
import { isBackendLanguage, visibleLanguageFilter } from "@/lib/backend-access";

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

  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Bitte melde dich an." }, { status: 401 });
  }

  const shortcuts = await prisma.shortcut.findMany({
    where: {
      aktiv: true,
      ...visibleLanguageFilter(session.user.role),
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

    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "Bitte melde dich an." }, { status: 401 });
    }
    const body = await request.json();

    const id = Number(body.id);
    const sprache = body.sprache ?? "";
    if (session.user.role !== "ADMIN" && isBackendLanguage(sprache)) {
      return Response.json({ error: "Dieser Bereich ist nur für Administratoren zugänglich." }, { status: 403 });
    }
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
        ...visibleLanguageFilter(session.user.role),
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
