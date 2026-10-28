import nodemailer from "nodemailer";

export async function sendPasswordResetEmail(email: string, token: string) {
  const service = process.env.SMTP_SERVICE;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const appUrl = process.env.APP_URL;

  if (!service || !user || !pass || !appUrl) {
    throw new Error("Die Einstellungen für den E-Mail-Versand fehlen.");
  }

  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });

  const resetUrl = new URL("/resetpassword", appUrl);
  resetUrl.searchParams.set("token", token);

  await transporter.sendMail({
    from: {
      name: "EckiHag",
      address: user,
    },
    to: email,
    subject: "Dein Passwort bei EckiHag zurücksetzen",
    text: [
      "Hallo!",
      "",
      "Du hast einen Link zum Zurücksetzen deines Passworts angefordert.",
      "",
      "Öffne dazu diesen Link:",
      resetUrl.toString(),
      "",
      "Der Link ist 30 Minuten gültig und kann nur einmal verwendet werden.",
      "",
      "Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.",
      "",
      "Viele Grüße",
      "EckiHag",
    ].join("\n"),
  });
}
