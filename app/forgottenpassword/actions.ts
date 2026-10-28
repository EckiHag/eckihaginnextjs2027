"use server";

import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailing";

export async function requestPasswordReset(_previousMessage: string, formData: FormData): Promise<string> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Bitte gib eine gültige E-Mail-Adresse ein.";
  }

  const message = "Falls ein aktives Konto zu dieser Adresse existiert, " + "erhältst du eine E-Mail mit einem Passwort-Link. " + "Bitte prüfe auch deinen Spamordner.";

  try {
    const user = await prisma.userEckiHack.findUnique({
      where: { email },
      select: {
        id: true,
        active: true,
      },
    });

    if (!user || !user.active) {
      return message;
    }

    // Wiederholte Anfragen innerhalb einer Minute überspringen.
    const recentRequest = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gt: new Date(Date.now() - 60_000),
        },
      },
      select: {
        id: true,
      },
    });

    if (recentRequest) {
      return message;
    }

    const token = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256").update(token).digest("hex");

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60_000),
      },
    });

    await sendPasswordResetEmail(email, token);
  } catch (error) {
    console.error("Passwort-Link konnte nicht verarbeitet werden:", error);
  }

  return message;
}
