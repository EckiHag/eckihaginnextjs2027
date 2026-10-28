"use server";

import { createHash } from "node:crypto";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

type ResetState = {
  success: boolean;
  message: string;
};

export async function resetPassword(_previousState: ResetState, formData: FormData): Promise<ResetState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return {
      success: false,
      message: "Der Passwort-Link ist ungültig.",
    };
  }

  if (password.length < 12) {
    return {
      success: false,
      message: "Das Passwort muss mindestens 12 Zeichen lang sein.",
    };
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    return {
      success: false,
      message: "Das Passwort ist zu lang. Bitte kürze es etwas.",
    };
  }

  if (password !== confirmation) {
    return {
      success: false,
      message: "Die beiden Passwörter stimmen nicht überein.",
    };
  }

  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    // Das zeitaufwendige Hashen erfolgt vor der Transaktion.
    const passwordHash = await bcrypt.hash(password, 12);

    const changed = await prisma.$transaction(
      async (tx) => {
        const now = new Date();

        // Nur ein noch gültiger, unbenutzter Link darf verwendet werden.
        const claimed = await tx.passwordResetToken.updateMany({
          where: {
            tokenHash,
            usedAt: null,
            expiresAt: { gt: now },
            user: { active: true },
          },
          data: {
            usedAt: now,
          },
        });

        if (claimed.count !== 1) {
          return false;
        }

        const record = await tx.passwordResetToken.findUniqueOrThrow({
          where: { tokenHash },
          select: { userId: true },
        });

        await tx.userEckiHack.update({
          where: { id: record.userId },
          data: {
            passwordHash,
            sessionVersion: {
              increment: 1,
            },
          },
        });

        // Auch andere offene Links dieses Kontos ungültig machen.
        await tx.passwordResetToken.updateMany({
          where: {
            userId: record.userId,
            usedAt: null,
          },
          data: {
            usedAt: now,
          },
        });

        return true;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    if (!changed) {
      return {
        success: false,
        message: "Der Link ist abgelaufen, ungültig oder bereits verwendet. " + "Bitte fordere einen neuen Link an.",
      };
    }

    return {
      success: true,
      message: "Dein Passwort wurde geändert. Du kannst dich jetzt anmelden.",
    };
  } catch (error) {
    console.error("Passwort konnte nicht zurückgesetzt werden:", error);

    return {
      success: false,
      message: "Das Passwort konnte nicht geändert werden. Bitte versuche es erneut.",
    };
  }
}
