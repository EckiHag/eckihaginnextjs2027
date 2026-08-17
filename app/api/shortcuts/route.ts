import { prisma } from "@/lib/prisma";

export async function GET() {
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
