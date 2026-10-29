"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@/app/generated/prisma/client";
import { sendAdminRegistrationEmail } from "@/lib/mailing";

type RegisterResult = {
  status: "success" | "error";
  message: string;
};

export async function registerUser(data: FormData): Promise<RegisterResult> {
  const username = String(data.get("username") ?? "").trim();
  const email = String(data.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(data.get("password") ?? "");
  const confirmation = String(data.get("passwordConfirmation") ?? "");
  const name = String(data.get("name") ?? "").trim();

  if (name.length > 150) {
    return {
      status: "error",
      message: "Der Name darf höchstens 150 Zeichen lang sein.",
    };
  }
  if (username.length < 3 || username.length > 100) {
    return {
      status: "error",
      message: "Der Benutzername muss zwischen 3 und 100 Zeichen lang sein.",
    };
  }

  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Bitte gib eine gültige E-Mail-Adresse ein.",
    };
  }

  if (password.length < 12) {
    return {
      status: "error",
      message: "Das Passwort muss mindestens 12 Zeichen lang sein.",
    };
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return {
      status: "error",
      message: "Das Passwort ist zu lang. Bitte kürze es etwas.",
    };
  }

  if (password !== confirmation) {
    return {
      status: "error",
      message: "Die beiden Passwörter stimmen nicht überein.",
    };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.userEckiHack.create({
      data: {
        name: name || null,
        username,
        email,
        passwordHash,
        role: UserRole.NEWBIE,
        active: true,
      },
      select: {
        id: true,
      },
    });

    try {
      await sendAdminRegistrationEmail({
        username,
        name,
        email,
      });
    } catch (mailError) {
      console.error("Benutzerkonto erstellt, aber Admin-Benachrichtigung fehlgeschlagen:", mailError);
    }

    return {
      status: "success",
      message: "Dein Konto wurde erstellt. Du kannst dich jetzt anmelden. Eine Freischaltung für Content erfolgt erst nach Freigabe durch Admin. Admin hat eine Mail erhalten.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        status: "error",
        message: "Benutzername oder E-Mail-Adresse ist bereits vergeben.",
      };
    }

    return {
      status: "error",
      message: "Das Konto konnte nicht erstellt werden. Bitte versuche es erneut.",
    };
  }
}
