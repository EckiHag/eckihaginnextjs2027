import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CreateUserPage() {
  const username = "eckhard";
  const password = "kzgbe2Amw";

  const existingUser = await prisma.userEckiHack.findUnique({
    where: {
      username,
    },
  });

  if (existingUser) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Benutzeranlage</h1>
        <p>Der Benutzer „{username}“ existiert bereits.</p>
      </main>
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.userEckiHack.create({
    data: {
      username,
      name: "Eckhard Hagemeier",
      passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Benutzeranlage erfolgreich</h1>

      <p>
        Der Benutzer <strong>{user.username}</strong> wurde angelegt.
      </p>

      <p>Die Datei dieser Seite muss jetzt wieder gelöscht werden.</p>
    </main>
  );
}
