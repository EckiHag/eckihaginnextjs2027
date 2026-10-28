import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/app/generated/prisma/client";
import { visibleLanguageFilter } from "@/lib/backend-access";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Bitte melde dich an." }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Die Anmeldung ist ungültig." }, { status: 401 });
    }

    const user = await prisma.userEckiHack.findUnique({
      where: {
        id: userId,
      },
      select: {
        active: true,
        role: true,
      },
    });

    const allowedRoles: UserRole[] = [UserRole.USER, UserRole.EDITOR, UserRole.ADMIN];

    if (!user || !user.active || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: "Du hast keinen Zugang zu diesen Daten." }, { status: 403 });
    }
    const languageAccess = visibleLanguageFilter(user.role);
    const searchParams = request.nextUrl.searchParams;

    const action = searchParams.get("action");
    const sprache = searchParams.get("sprache") ?? "";
    const book = searchParams.get("book") ?? "";
    const chapter = searchParams.get("chapter") ?? "";

    /*
     * 1. Eine neue Sprache wurde ausgewählt.
     *
     * Zurückgegeben werden:
     * - alle Bücher der Sprache
     * - alle Kapitel des ersten Buches
     * - die Vokabeln des ersten Kapitels
     */
    if (action === "sprache") {
      if (!sprache) {
        return NextResponse.json({ error: "Die Sprache fehlt." }, { status: 400 });
      }

      const bookRows = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book: {
            not: "",
          },
        },
        select: {
          book: true,
        },
        distinct: ["book"],
        orderBy: {
          book: "asc",
        },
      });

      const books = bookRows.map((row) => row.book);
      const firstBook = books[0] ?? "";

      if (!firstBook) {
        return NextResponse.json({
          books: [],
          selectedBook: "",
          chapters: [],
          selectedChapter: "",
          vocs: [],
        });
      }

      const chapters = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book: firstBook,
          chapter: {
            not: "",
          },
        },
        select: {
          chapter: true,
        },
        distinct: ["chapter"],
        orderBy: {
          chapter: "asc",
        },
      });

      const firstChapter = chapters[0]?.chapter ?? "";

      const vocs = firstChapter
        ? await prisma.vocs.findMany({
            where: {
              AND: [languageAccess],
              sprache,
              book: firstBook,
              chapter: firstChapter,
            },
            orderBy: [
              {
                ord: "asc",
              },
              {
                id: "asc",
              },
            ],
          })
        : [];

      return NextResponse.json({
        books,
        selectedBook: firstBook,
        chapters,
        selectedChapter: firstChapter,
        vocs,
      });
    }

    /*
     * 2. Ein neues Buch wurde ausgewählt.
     *
     * Zurückgegeben werden:
     * - alle Kapitel des Buches
     * - die Vokabeln des ersten Kapitels
     */
    if (action === "book") {
      if (!sprache || !book) {
        return NextResponse.json({ error: "Sprache oder Buch fehlt." }, { status: 400 });
      }

      const chapters = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          chapter: {
            not: "",
          },
        },
        select: {
          chapter: true,
        },
        distinct: ["chapter"],
        orderBy: {
          chapter: "asc",
        },
      });

      const firstChapter = chapters[0]?.chapter ?? "";

      const vocs = firstChapter
        ? await prisma.vocs.findMany({
            where: {
              AND: [languageAccess],
              sprache,
              book,
              chapter: firstChapter,
            },
            orderBy: [
              {
                ord: "asc",
              },
              {
                id: "asc",
              },
            ],
          })
        : [];

      return NextResponse.json({
        chapters,
        selectedChapter: firstChapter,
        vocs,
      });
    }

    /*
     * 3. Ein neues Kapitel wurde ausgewählt.
     *
     * Zurückgegeben werden nur die Vokabeln.
     */
    if (action === "chapter") {
      if (!sprache || !book || !chapter) {
        return NextResponse.json({ error: "Sprache, Buch oder Kapitel fehlt." }, { status: 400 });
      }

      const vocs = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          chapter,
        },
        orderBy: [
          {
            ord: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

      return NextResponse.json({
        vocs,
      });
    }

    /*
     * 4. Ein Shortcut wurde ausgewählt.
     *
     * Zurückgegeben werden:
     * - alle Bücher der Sprache
     * - alle Kapitel des ausgewählten Buches
     * - die Vokabeln des ausgewählten Kapitels
     */
    if (action === "shortcut") {
      if (!sprache || !book || !chapter) {
        return NextResponse.json({ error: "Sprache, Buch oder Kapitel fehlt." }, { status: 400 });
      }

      const bookRows = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book: {
            not: "",
          },
        },
        select: {
          book: true,
        },
        distinct: ["book"],
        orderBy: {
          book: "asc",
        },
      });

      const books = bookRows.map((row) => row.book);

      const chapters = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          chapter: {
            not: "",
          },
        },
        select: {
          chapter: true,
        },
        distinct: ["chapter"],
        orderBy: {
          chapter: "asc",
        },
      });

      const vocs = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          chapter,
        },
        orderBy: [
          {
            ord: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

      return NextResponse.json({
        books,
        chapters,
        vocs,
      });
    }

    if (action === "chapterGroup") {
      const sprache = searchParams.get("sprache") ?? "";
      const book = searchParams.get("book") ?? "";
      const prefix = searchParams.get("prefix") ?? "";

      if (!sprache || !book || !prefix) {
        return Response.json({ error: "Sprache, Buch und Kapitelgruppe sind erforderlich." }, { status: 400 });
      }

      const vocs = await prisma.vocs.findMany({
        where: {
          sprache,
          book,
          chapter: {
            startsWith: prefix,
          },
        },
        orderBy: [
          {
            wort: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

      return Response.json({ vocs });
    }

    if (action === "letterGroup") {
      const prefix = searchParams.get("prefix") ?? "";

      if (!sprache || !book || !prefix) {
        return NextResponse.json({ error: "Sprache, Buch und Buchstabe sind erforderlich." }, { status: 400 });
      }

      const vocs = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          wort: {
            startsWith: prefix,
          },
        },
        orderBy: [
          {
            wort: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

      return NextResponse.json({ vocs });
    }

    if (action === "wordSearch") {
      const prefix = searchParams.get("prefix") ?? "";

      if (!sprache || !book || prefix.length < 3) {
        return NextResponse.json({ error: "Für die Wortsuche sind mindestens drei Buchstaben erforderlich." }, { status: 400 });
      }

      const vocs = await prisma.vocs.findMany({
        where: {
          AND: [languageAccess],
          sprache,
          book,
          wort: {
            contains: prefix,
          },
        },
        orderBy: [
          {
            wort: "asc",
          },
          {
            id: "asc",
          },
        ],
      });

      return NextResponse.json({ vocs });
    }

    return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
  } catch (error) {
    console.error("Fehler in /api/vokabeln:", error);

    return NextResponse.json(
      {
        error: "Die Daten konnten nicht geladen werden.",
      },
      {
        status: 500,
      },
    );
  }
}
